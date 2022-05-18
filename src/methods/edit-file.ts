import * as anchor from "@project-serum/anchor";
import {
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
  tokenMint,
  uploader,
} from "../utils/common";
import crypto from "crypto";
import { ShadowFile, ShadowUploadResponse } from "../types";
import fetch from "cross-fetch";
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of Storage Account
 * @param {string} url - URL of existing file
 * @param {File | ShadowFile} data - File or ShadowFile object, file extensions should be included in the name property of ShadowFiles.
 * @returns {ShadowUploadResponse} - File location and transaction signature
 */

export default async function editFile(
  key: anchor.web3.PublicKey,
  url: string,
  data: File | ShadowFile
): Promise<ShadowUploadResponse> {
  let fileErrors = [];
  let fileBuffer: Buffer;
  let form;
  let file;
  if (!isBrowser) {
    data = data as ShadowFile;
    const { default: FormData } = await import("form-data");
    form = new FormData();
    file = data.file as Buffer;
    form.append("file", data.file, data.name);
    fileBuffer = form.getBuffer();
  } else {
    file = data as File;
    form = new FormData();
    form.append("file", file, file.name);
    fileBuffer = Buffer.from(await file.text());
  }
  const selectedAccount = await this.program.account.storageAccount.fetch(key);

  if (fileBuffer.byteLength > 1_073_741_824 * 1) {
    fileErrors.push({
      file: file,
      erorr: "Exceeds the 1GB limit.",
    });
  }
  const fileNameBytes = new TextEncoder().encode(data.name).length;
  if (fileNameBytes > 32) {
    fileErrors.push({
      file: file,
      error: "File name too long. Reduce to 32 bytes long.",
    });
  }
  if (fileErrors.length) {
    return Promise.reject(fileErrors);
  }
  const userInfoAccount = await this.connection.getAccountInfo(this.userInfo);
  if (userInfoAccount === null) {
    return Promise.reject(
      new Error(
        "You have not created a storage account on Shadow Drive yet. Please see the 'create-storage-account' command to get started."
      )
    );
  }
  const existingFileData = await fetch(
    `${SHDW_DRIVE_ENDPOINT}/get-object-data`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: url,
      }),
    }
  );
  const fileDataResponse = await existingFileData.json();
  const fileOwnerOnChain = new anchor.web3.PublicKey(
    fileDataResponse.file_data["owner-account-pubkey"]
  );
  if (fileOwnerOnChain.toBase58() != this.wallet.publicKey.toBase58()) {
    return Promise.reject(new Error("Permission denied: Not file owner"));
  }
  const fileAcc = new anchor.web3.PublicKey(
    fileDataResponse.file_data["file-account-pubkey"]
  );
  const hashSum = crypto.createHash("sha256");
  hashSum.update(fileBuffer);
  const sha256Hash = hashSum.digest("hex");
  let size = new anchor.BN(fileBuffer.byteLength);
  let txn;
  try {
    txn = await this.program.methods
      .editFile(sha256Hash, size)
      .accounts({
        storageConfig: this.storageConfigPDA,
        storageAccount: key,
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
    const uploadResponse = await fetch(`${SHDW_DRIVE_ENDPOINT}/edit`, {
      method: "POST",
      //@ts-ignore
      body: data,
    });
    if (!uploadResponse.ok) {
      return Promise.reject(
        new Error(
          `Server response status code: ${uploadResponse.status} \n Server response status message: ${uploadResponse.statusText}`
        )
      );
    }
    const responseJson = await uploadResponse.json();
    return Promise.resolve(responseJson);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
