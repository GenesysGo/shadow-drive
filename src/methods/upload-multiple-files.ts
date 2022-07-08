import * as anchor from "@project-serum/anchor";
import { isBrowser, SHDW_DRIVE_ENDPOINT } from "../utils/common";
import crypto from "crypto";
import { ShadowBatchUploadResponse, ShadowFile, ListObjectsResponse } from "../types";
import NodeFormData from "form-data";
import { sleep, getChunkLength } from "../utils/helpers";
import fetch from "cross-fetch";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import nacl from "tweetnacl";

interface FileData {
  name: string;
  buffer: Buffer;
  file: Buffer | File;
  form?: any;
  size: anchor.BN;
  url: string;
}
/**
 *
 * @param {anchor.web3.PublicKey} key - Storage account PublicKey to upload the files to.
 * @param {FileList | ShadowFile[]} data[] - Array of Files or ShadowFile objects to be uploaded
 * @returns {ShadowBatchUploadResponse[]} - File names, locations and transaction signatures for uploaded files.
 */

export default async function uploadMultipleFiles(
  key: anchor.web3.PublicKey,
  data: FileList | ShadowFile[]
): Promise<ShadowBatchUploadResponse[]> {
  let fileData: Array<FileData> = [];
  const fileErrors: Array<object> = [];
  let existingUploadJSON: ShadowBatchUploadResponse[] = [];
  /**
   *
   * Prepare files for uploading.
   */
  if (!isBrowser) {
    data = data as ShadowFile[];
    data.forEach(async (shdwFile: ShadowFile) => {
      let form = new NodeFormData();
      let file = shdwFile.file;
      form.append("file", file, shdwFile.name);
      let fileBuffer = form.getBuffer();
      if (fileBuffer.byteLength > 1_073_741_824 * 1) {
        fileErrors.push({
          file: file,
          erorr: "Exceeds the 1GB limit.",
        });
      }
      const url = encodeURI(
        `https://shdw-drive.genesysgo.net/${key.toString()}/${shdwFile.name}`
      );
      let size = new anchor.BN(fileBuffer.byteLength);
      fileData.push({
        name: shdwFile.name,
        buffer: fileBuffer,
        file: file,
        form: form,
        size: size,
        url: url,
      });
    });
  } else {
    data = data as FileList;
    for (const shdwFile of data) {
      let file = shdwFile;
      let form = new FormData();
      form.append("file", file, shdwFile.name);
      let fileBuffer = Buffer.from(new Uint8Array(await file.arrayBuffer()));
      if (fileBuffer.byteLength > 1_073_741_824 * 1) {
        fileErrors.push({
          file: file,
          erorr: "Exceeds the 1GB limit.",
        });
      }
      const url = encodeURI(
        `https://shdw-drive.genesysgo.net/${key.toString()}/${shdwFile.name}`
      );
      let size = new anchor.BN(fileBuffer.byteLength);
      fileData.push({
        name: shdwFile.name,
        buffer: fileBuffer,
        file: file,
        form: form,
        size: size,
        url: url,
      });
    }
  }
  if (fileErrors.length) {
    return Promise.reject(fileErrors);
  }
  if (!this.userInfo) {
    return Promise.reject(
      "You have not created a storage account on Shadow Drive yet. Please see the 'create-storage-account' command to get started."
    );
  }
  let allObjectsRequest = await fetch(`${SHDW_DRIVE_ENDPOINT}/list-objects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ storageAccount: key.toString() }),
  });
  if (!allObjectsRequest.status) {
    return Promise.reject(
      new Error(`Server response status code: ${allObjectsRequest.status} \n
        			Server response status message: ${
                (await allObjectsRequest.json()).error
              }`)
    );
  }

  /*
    Note: Currently if there are no objects stored in an account the API will throw a 500 http error.

    Providing a false negative status and preventing to upload multiple files on new accounts.

    The best way to solve this would be to directly return an empty keys array from the API.

    For now we'll need to handle this from here by initializing the objects ourselves.
  */
  let allObjects: ListObjectsResponse = { keys: [] };
  let existingFiles: ShadowBatchUploadResponse[] = [];

  // Only if successful, we assign the objects coming from the response.
  if (allObjectsRequest.status === 200) allObjects = await allObjectsRequest.json() as ListObjectsResponse;

  fileData = fileData.filter((item: FileData) => {
    if (!allObjects.keys.includes(item.name)) {
      return true;
    } else {
      existingFiles.push({
        fileName: item.name,
        status: "Not uploaded: File already exists.",
        location: item.url,
      });
      return false;
    }
  });

  const allFileNames = fileData.map((file) => file.name);
  const hashSum = crypto.createHash("sha256");
  hashSum.update(allFileNames.toString());
  const fileNamesHashed = hashSum.digest("hex");
  let encodedMsg;
  try {
    const msg = new TextEncoder().encode(
      `Shadow Drive Signed Message:\nStorage Account: ${key}\nUpload files with hash: ${fileNamesHashed}`
    );
    let msgSig;
    if (!this.wallet.signMessage) {
      msgSig = nacl.sign.detached(Buffer.from(msg, "utf-8"), this.wallet.payer.secretKey);
    } else {
      msgSig = await this.wallet.signMessage(Buffer.from(msg, "utf-8"));
    }
    encodedMsg = bs58.encode(msgSig.signature);
  } catch (e) {
    console.log("Could not hash file names",e);
  }

  let chunks = [];
  let indivChunk: Array<number> = [];
  for (let chunkIdx = 0; chunkIdx < fileData.length; chunkIdx++) {
    if (indivChunk.length === 0) {
      indivChunk.push(chunkIdx);
      // Handle when a fresh individual chunk is equal to the file data's length
      let allChunksSum = getChunkLength(indivChunk, chunks);
      if (allChunksSum === fileData.length) {
        chunks.push(indivChunk);
        continue;
      }
      continue;
    }

    let fileNames = indivChunk.map((c: any) => fileData[c].name);
    const namesLength = Buffer.byteLength(Buffer.from(fileNames.join()));
    const currentNameBufferLength = Buffer.byteLength(
      Buffer.from(fileData[chunkIdx].name)
    );
    if (
      indivChunk.length < 5 &&
      namesLength < 154 &&
      currentNameBufferLength + namesLength < 154
    ) {
      indivChunk.push(chunkIdx);
      if (chunkIdx == fileData.length - 1) {
        chunks.push(indivChunk);
        indivChunk = [];
      }
    } else {
      chunks.push(indivChunk);
      indivChunk = [chunkIdx];
      let allChunksSum = getChunkLength(indivChunk, chunks);
      if (allChunksSum === fileData.length) {
        chunks.push(indivChunk);
        continue;
      }
    }
  }

  for (let i = 0; i < chunks.length; i++) {
    let indivChunk = chunks[i];
    let actualFiles: any = [];
    let fileNames = [];
    let sha256Hashs = [];
    let sizes = [];
    for (let j = 0; j <= indivChunk.length - 1; j++) {
      let index = indivChunk[j];
      const { name, buffer, file, form, size, url } = fileData[index];
      fileNames.push(name);
      sizes.push(size);
      let data = buffer;
      const hashSum = crypto.createHash("sha256");
      hashSum.update(data);
      const sha256Hash = hashSum.digest("hex");
      sha256Hashs.push(sha256Hash);
      actualFiles.push({
        name,
        data,
        file,
        form,
        sha256Hash,
        size,
        url,
      });
    }
    let continueToNextBatch = false;
    let currentRetries = 0;
    let updatedStorageAccount: any;

    if (existingFiles.length > 0) {
      existingUploadJSON.push(...existingFiles);
    }
    while (!continueToNextBatch) {
      try {
        let fd;
        if (!isBrowser) {
          fd = new NodeFormData();
        } else {
          fd = new FormData();
        }
        for (let j = 0; j < actualFiles.length; j++) {
          let file;
          if (!isBrowser) {
            file = actualFiles[j].file;
          } else {
            file = actualFiles[j].file as File;
          }
          fd.append("file", file, actualFiles[j].name);
        }

        fd.append("message", encodedMsg);
        fd.append("storage_account", key.toString());
        fd.append("signer", this.wallet.publicKey.toString());
        fd.append("fileNames", allFileNames.toString());
        // fd.append(
        //   "transaction",
        //   Buffer.from(serializedTxn.toJSON().data).toString("base64")
        // );
        const request = await fetch(`${SHDW_DRIVE_ENDPOINT}/upload`, {
          method: "POST",
          //@ts-ignore
          body: fd,
        });
        if (!request.ok) {
          const error = (await request.json()).error;
          console.log(`Server response status code: ${request.status}`);
          console.log(`Server response status message: ${error}`);
          if (
            error.toLowerCase().includes("timed out") ||
            error.toLowerCase().includes("blockhash") ||
            error.toLowerCase().includes("unauthorized signer") ||
            error.toLowerCase().includes("node is behind") ||
            error.toLowerCase().includes("was not confirmed in")
          ) {
            currentRetries += 1;
            console.log(`Transaction Retry #${currentRetries}`);
          } else {
            fileNames.map((name, idx) => {
              existingUploadJSON.push({
                fileName: name,
                status: `Not uploaded: ${error}`,
                location: null,
              });
            });
            continueToNextBatch = true;
          }
        } else {
          const responseJson = await request.json();
          fileNames.map((name, idx) => {
            existingUploadJSON.push({
              fileName: name,
              status: "Uploaded.",
              location: actualFiles[idx].url,
            });
          });
          continueToNextBatch = true;
        }
      } catch (e) {
        fileNames.map((name, idx) => {
          existingUploadJSON.push({
            fileName: name,
            status: `Not uploaded: ${e}`,
            location: null,
          });
        });
        continueToNextBatch = true;
        console.log(e);
      }
    }
    await sleep(500);
  }
  return Promise.resolve(existingUploadJSON);
}
