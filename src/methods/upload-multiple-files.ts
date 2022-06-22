import * as anchor from "@project-serum/anchor";
import {
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
  tokenMint,
  uploader,
} from "../utils/common";
import crypto from "crypto";
import { ShadowBatchUploadResponse, ShadowFile, ListObjectsResponse } from "../types";
import NodeFormData from "form-data";
import { sleep, sortByProperty, getChunkLength } from "../utils/helpers";
import fetch from "cross-fetch";

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
 *
 * @returns {ShadowBatchUploadResponse[]} - File names, locations and transaction signatures for uploaded files.
 */

export default async function uploadMultipleFiles(
  key: anchor.web3.PublicKey,
  data: FileList | ShadowFile[]
): Promise<ShadowBatchUploadResponse[]> {
  const selectedAccount = await this.program.account.storageAccount.fetch(key);
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
      const fileNameBytes = new TextEncoder().encode(shdwFile.name).length;
      if (fileNameBytes > 32) {
        fileErrors.push({
          file: file,
          error: "File name too long. Reduce to 32 bytes long.",
        });
      }
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
      let arrayBuff = await file.arrayBuffer();
      if (arrayBuff.byteLength > 1_073_741_824 * 1) {
        fileErrors.push({
          file: file,
          erorr: "Exceeds the 1GB limit.",
        });
      }
      const fileNameBytes = new TextEncoder().encode(shdwFile.name).length;
      if (fileNameBytes > 32) {
        fileErrors.push({
          file: file,
          error: "File name too long. Reduce to 32 bytes long.",
        });
      }
      const url = encodeURI(
        `https://shdw-drive.genesysgo.net/${key.toString()}/${shdwFile.name}`
      );
      let size = new anchor.BN(arrayBuff.byteLength);
      fileData.push({
        name: shdwFile.name,
        buffer: Buffer.from(arrayBuff),
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
  const allObjects = await allObjectsRequest.json() as ListObjectsResponse;
  let existingFiles: any = [];
  fileData = fileData.filter((item: any) => {
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
  let previousSeed = selectedAccount.initCounter;
  let newFileSeedToSet = selectedAccount.initCounter;

  for (let i = 0; i < chunks.length; i++) {
    let indivChunk = chunks[i];
    let actualFiles: any = [];
    let fileNames = [];
    let sha256Hashs = [];
    let sizes = [];
    let fileAccounts = [];
    let fileSeeds = [];
    for (let j = 0; j <= indivChunk.length - 1; j++) {
      let index = indivChunk[j];
      const { name, buffer, file, form, size, url } = fileData[index];
      let fileSeed = new anchor.BN(newFileSeedToSet);

      let [fileAccount, fileBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            key.toBytes(),
            new anchor.BN(fileSeed).toTwos(64).toArrayLike(Buffer, "le", 4),
          ],
          this.program.programId
        );
      fileNames.push(name);
      sizes.push(size);
      fileAccounts.push({ fileAccount, seed: fileSeed });
      fileSeeds.push(fileSeed);
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
      previousSeed = fileSeed.toNumber();
      newFileSeedToSet = fileSeed.toNumber() + 1;
    }
    let sortedFileAccounts = fileAccounts.sort(sortByProperty("seed"));
    let continueToNextBatch = false;
    let currentRetries = 0;
    let accountReadyForNextTransaction = false;
    let updatedStorageAccount: any;
    while (!accountReadyForNextTransaction) {
      updatedStorageAccount = await this.program.account.storageAccount.fetch(
        key
      );
      console.log(
        "Expected next file seed on chain to be:",
        sortedFileAccounts[0].seed.toNumber()
      );
      console.log(
        "Actual next file seed on chain:",
        updatedStorageAccount.initCounter
      );
      if (
        updatedStorageAccount.initCounter ==
        sortedFileAccounts[0].seed.toNumber()
      ) {
        console.log("Chain has up to date info. Moving onto the next batch.");
        accountReadyForNextTransaction = true;
      } else {
        console.log(
          "Chain does not have up to date info. Waiting 1s to check again."
        );
      }
      await sleep(1000);
    }
    if (existingFiles.length > 0) {
      existingUploadJSON.push(existingFiles);
    }
    while (!continueToNextBatch) {
      try {
        const txn = await this.program.methods
          .storeFile(fileNames[0], sha256Hashs[0], sizes[0])
          .accounts({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            userInfo: this.userInfo,
            owner: selectedAccount.owner1,
            uploader: uploader,
            tokenMint: tokenMint,
            systemProgram: anchor.web3.SystemProgram.programId,
            file: sortedFileAccounts[0].fileAccount,
          })
          .transaction();

        for (let fileIx = 1; fileIx < fileNames.length; fileIx++) {
          const ixn = await this.program.methods
            .storeFile(fileNames[fileIx], sha256Hashs[fileIx], sizes[fileIx])
            .accounts({
              storageConfig: this.storageConfigPDA,
              storageAccount: key,
              userInfo: this.userInfo,
              owner: selectedAccount.owner1,
              uploader: uploader,
              tokenMint: tokenMint,
              systemProgram: anchor.web3.SystemProgram.programId,
              file: sortedFileAccounts[fileIx].fileAccount,
            })
            .instruction();
          txn.add(ixn);
        }
        txn.recentBlockhash = (
          await this.connection.getLatestBlockhash()
        ).blockhash;
        txn.feePayer = this.wallet.publicKey;
        if (!isBrowser) {
          await txn.partialSign(this.wallet.payer);
        } else {
          await this.wallet.signTransaction(txn);
        }
        const serializedTxn = txn.serialize({
          requireAllSignatures: false,
        });
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
        fd.append(
          "transaction",
          Buffer.from(serializedTxn.toJSON().data).toString("base64")
        );
        const request = await fetch(`${SHDW_DRIVE_ENDPOINT}/upload-batch`, {
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
            newFileSeedToSet = updatedStorageAccount!.initCounter;
            fileNames.map((name, idx) => {
              existingUploadJSON.push({
                fileName: name,
                status: `Not uploaded: ${error}`,
                location: null,
                transaction_signature: null
              });
            });
            continueToNextBatch = true;
            // await sleep(750);
          }
        } else {
          const responseJson = await request.json();
          console.log(
            `Solana transaction signature: ${responseJson.transaction_signature}`
          );
          fileNames.map((name, idx) => {
            existingUploadJSON.push({
              fileName: name,
              status: "Uploaded.",
              location: actualFiles[idx].url,
              transaction_signature: responseJson.transaction_signature
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
            transaction_signature: null
          });
        });
        continueToNextBatch = true;
        newFileSeedToSet = updatedStorageAccount!.initCounter;
        console.log(e);
      }
    }
    await sleep(500);
  }
  return Promise.resolve(existingUploadJSON);
}
