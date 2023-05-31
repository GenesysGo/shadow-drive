import * as anchor from "@coral-xyz/anchor";
import { isBrowser, SHDW_DRIVE_ENDPOINT } from "../utils/common";
import crypto from "crypto";
import {
  ShadowBatchUploadResponse,
  ShadowFile,
  ListObjectsResponse,
} from "../types";
import NodeFormData from "form-data";
import { getChunkLength } from "../utils/helpers";
import fetch from "cross-fetch";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import nacl from "tweetnacl";
import { from, map, mergeMap, toArray } from "rxjs";

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
 * @param {Number} concurrent - Number of files to concurrently upload. Default: 3
 * @param {Function} callback - Callback function for every batch of files uploaded. A number will be passed into the callback like `callback(num)` indicating the number of files that were confirmed in that specific batch.
 * @returns {ShadowBatchUploadResponse[]} - File names, locations and transaction signatures for uploaded files.
 */

export default async function uploadMultipleFiles(
  key: anchor.web3.PublicKey,
  data: FileList | ShadowFile[],
  concurrent = 3,
  callback?: Function
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
  if (allObjectsRequest.status === 200)
    allObjects = (await allObjectsRequest.json()) as ListObjectsResponse;

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

  // Only continue with upload process if there's files to process
  if (fileData.length) {
    const allFileNames = fileData.map((file) => file.name);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(allFileNames.toString());
    const fileNamesHashed = hashSum.digest("hex");
    let encodedMsg: string;
    try {
      const msg = new TextEncoder().encode(
        `Shadow Drive Signed Message:\nStorage Account: ${key}\nUpload files with hash: ${fileNamesHashed}`
      );
      let msgSig: Uint8Array;
      if (!this.wallet.signMessage) {
        msgSig = nacl.sign.detached(msg, this.wallet.payer.secretKey);
      } else {
        msgSig = await this.wallet.signMessage(msg);
      }
      encodedMsg = bs58.encode(msgSig);
    } catch (e) {
      console.log("Could not hash file names", e);
      return Promise.reject(new Error(e));
    }

    let chunks: number[][] = [];
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
    const appendFileToItem = (item: any) => {
      const { name, size, buffer, ...props } = item;
      let data = buffer;
      const hashSum = crypto.createHash("sha256");
      hashSum.update(data);
      const sha256Hash = hashSum.digest("hex");
      return {
        sha256Hash,
        name,
        size,
        buffer,
        ...props,
      };
    };

    return new Promise((resolve) => {
      from(chunks)
        .pipe(
          map((indivChunk: number[]) => {
            return indivChunk.map((index: number) =>
              appendFileToItem(fileData[index])
            );
          }),
          mergeMap(
            async (items) => {
              let fd;
              if (!isBrowser) {
                fd = new NodeFormData();
              } else {
                fd = new FormData();
              }
              for (const item of items) {
                let file;
                if (!isBrowser) {
                  file = item.file;
                } else {
                  file = item.file as File;
                }
                fd.append("file", file, item.name);
              }

              fd.append("message", encodedMsg);
              fd.append("storage_account", key.toString());
              fd.append("signer", this.wallet.publicKey.toString());
              fd.append("fileNames", allFileNames.toString());
              const response = await fetch(`${SHDW_DRIVE_ENDPOINT}/upload`, {
                method: "POST",
                //@ts-ignore
                body: fd,
              });

              if (!response.ok) {
                const error = (await response.json()).error;
                return items.map((item) => ({
                  fileName: item.name,
                  status: `Not uploaded: ${error}`,
                  location: null,
                }));
              } else {
                const responseJson = await response.json();
                if (responseJson.upload_errors.length) {
                  // TODO add type here
                  return responseJson.upload_errors.map((error: any) => ({
                    fileName: error.file,
                    status: `Not uploaded: ${error.error}`,
                    location: null as string,
                  }));
                }
                if (typeof callback == "function") {
                  callback(items.length);
                }
                return items.map((item) => ({
                  fileName: item.name,
                  status: "Uploaded.",
                  location: item.url,
                }));
              }
            },
            fileData.length > 1 ? concurrent : 1
          ),
          // zip them up into a flat array once all are done to get full result list
          toArray(),
          map((res) => res.flat())
        )
        .subscribe((res) => {
          resolve([...res, ...existingFiles]);
        });
    });
  } else {
    return new Promise((resolve) => {
      if (typeof callback == "function") {
        callback(existingFiles.length);
      }
      resolve(existingFiles);
    });
  }
}
