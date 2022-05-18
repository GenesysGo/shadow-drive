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
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of Storage Account.
 * @param {File | ShadowFile} data - File or ShadowFile object, file extensions should be included in the name property of ShadowFiles.
 *
 * @returns {ShadowUploadResponse} - File location and transaction signature.
 */
export default async function uploadFile(
  key: anchor.web3.PublicKey,
  data: File | ShadowFile
): Promise<ShadowUploadResponse> {
  let fileErrors = [];
  let fileBuffer: Buffer;
  let form;
  let file;
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
    fileBuffer = Buffer.from(await file.text());
  }
  const selectedAccount = await this.program.account.storageAccount.fetch(key);

  if (fileBuffer.byteLength > 1_073_741_824 * 1) {
    fileErrors.push({
      file: data.name,
      erorr: "Exceeds the 1GB limit.",
    });
  }
  const fileNameBytes = new TextEncoder().encode(data.name).length;
  if (fileNameBytes > 32) {
    fileErrors.push({
      file: data.name,
      error: "File name too long. Reduce to 32 bytes long.",
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
  const hashSum = crypto.createHash("sha256");
  hashSum.update(fileBuffer);
  const sha256Hash = hashSum.digest("hex");

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
    txn = await this.program.methods
      .storeFile(data.name, sha256Hash, size)
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
        			Server response status message: ${uploadResponse.statusText}`)
      );
    }
    const responseJson = await uploadResponse.json();
    return Promise.resolve(responseJson);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
