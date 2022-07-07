import * as anchor from "@project-serum/anchor";
import {
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
  tokenMint,
  uploader,
} from "../utils/common";
import crypto from "crypto";
import fetch from "cross-fetch";
import { ShadowFile, ShadowUploadResponse } from "../types";
import NodeFormData from "form-data";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import nacl from "tweetnacl";
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of Storage Account.
 * @param {File | ShadowFile} data - File or ShadowFile object, file extensions should be included in the name property of ShadowFiles.
 * @param {string} version - ShadowDrive version (v1 or v2)
 * @returns {ShadowUploadResponse} File location and transaction signature.
 */
export default async function uploadFile(
  key: anchor.web3.PublicKey,
  data: File | ShadowFile,
  version: string
): Promise<ShadowUploadResponse> {
  let fileErrors = [];
  let fileBuffer: Buffer;
  let form;
  let file;

  let selectedAccount;
  switch (version.toLocaleLowerCase()) {
    case "v1":
      selectedAccount = await this.program.account.storageAccount.fetch(key);
      break;
    case "v2":
      selectedAccount = await this.program.account.storageAccountV2.fetch(key);
      break;
  }

  if (!isBrowser) {
    data = data as ShadowFile;
    form = new NodeFormData();
    file = data.file;
    form.append("file", file, data.name);
    fileBuffer = file;
  } else {
    file = data as File;
    form = new FormData();
    form.append("file", file, file.name);
    fileBuffer = Buffer.from(new Uint8Array(await file.arrayBuffer()));
  }

  if (fileBuffer.byteLength > 1_073_741_824 * 1) {
    fileErrors.push({
      file: data.name,
      erorr: "Exceeds the 1GB limit.",
    });
  }
  /**
   *
   * Users must remember to include the file extension when uploading from Node.
   *
   */
  //   if (!isBrowser && data.name.lastIndexOf(".") == -1) {
  //     fileErrors.push({
  //       file: data.name,
  //       error: "File extension must be included.",
  //     });
  //   }
  if (fileErrors.length) {
    return Promise.reject(fileErrors);
  }
  if (!this.userInfo) {
    return Promise.reject(
      "You have not created a storage account on Shadow Drive yet. Please see the 'create-storage-account' command to get started."
    );
  }
  const fileHashSum = crypto.createHash("sha256");
  const fileNameHashSum = crypto.createHash("sha256");
  fileHashSum.update(
    Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer)
  );
  fileNameHashSum.update(data.name);
  const fileHash = fileHashSum.digest("hex");
  const fileNameHash = fileNameHashSum.digest("hex");
  let size = new anchor.BN(fileBuffer.byteLength);
  let fileSeed = selectedAccount.initCounter;
  let [fileAcc, fileBump] = await anchor.web3.PublicKey.findProgramAddress(
    [
      key.toBytes(),
      new anchor.BN(fileSeed).toTwos(64).toArrayLike(Buffer, "le", 4),
    ],
    this.program.programId
  );
  let txn;
  try {
    const msg = new TextEncoder().encode(
      `Shadow Drive Signed Message:\nStorage Account: ${key}\nUpload files with hash: ${fileNameHash}`
    );
    let msgSig: Uint8Array;
    if (!this.wallet.signMessage) {
      msgSig = nacl.sign.detached(msg, this.wallet.payer.secretKey);
    } else {
      msgSig = await this.wallet.signMessage(msg);
    }
    const encodedMsg = bs58.encode(msgSig);
    form.append("fileNames", data.name);
    form.append("message", encodedMsg);
    form.append("storage_account", key.toString());
    form.append("signer", this.wallet.publicKey.toString());
  } catch (e) {
    return Promise.reject(new Error(e));
  }
  if (version.toLocaleLowerCase() === "v1") {
    try {
      txn = await this.program.methods
        .storeFile(data.name, fileHash, size)
        .accounts({
          storageConfig: this.storageConfigPDA,
          storageAccount: key,
          userInfo: this.userInfo,
          file: fileAcc,
          owner: selectedAccount.owner1,
          uploader: uploader,
          tokenMint: tokenMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .transaction();
      txn.recentBlockhash = (
        await this.connection.getLatestBlockhash()
      ).blockhash;
      txn.feePayer = this.wallet.publicKey;
      if (!isBrowser) {
        await txn.partialSign(this.wallet.payer);
      } else {
        await this.wallet.signTransaction(txn);
      }
      const serializedTxn = txn.serialize({ requireAllSignatures: false });
      form.append(
        "transaction",
        Buffer.from(serializedTxn.toJSON().data).toString("base64")
      );
    } catch (e) {
      return Promise.reject(new Error(e));
    }
    try {
      const uploadResponse = await fetch(`${SHDW_DRIVE_ENDPOINT}/upload`, {
        method: "POST",
        //@ts-ignore
        body: form,
      });
      if (!uploadResponse.ok) {
        return Promise.reject(
          new Error(`Server response status code: ${uploadResponse.status} \n
						Server response status message: ${(await uploadResponse.json()).error}`)
        );
      }
      const responseJson = await uploadResponse.json();
      return Promise.resolve(responseJson);
    } catch (e) {
      return Promise.reject(new Error(e));
    }
  } else {
    try {
      const uploadResponse = await fetch(`${SHDW_DRIVE_ENDPOINT}/upload`, {
        method: "POST",
        //@ts-ignore
        body: form,
      });
      if (!uploadResponse.ok) {
        return Promise.reject(
          new Error(`Server response status code: ${uploadResponse.status} \n 
				  Server response status message: ${(await uploadResponse.json()).error}`)
        );
      }
      const responseJson = await uploadResponse.json();
      return Promise.resolve(responseJson);
    } catch (e) {
      return Promise.reject(new Error(e));
    }
  }
}
