import * as anchor from "@project-serum/anchor";
import {
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
  tokenMint,
  uploader,
} from "../utils/common";
import { PublicKey } from "@solana/web3.js";
import FormData from "form-data";
import crypto from "crypto";
import { ShadowUploadResponse } from "../types";
import fetch from "node-fetch";
import { Buffer } from "buffer";
/**
 *
 * @param {PublicKey} key - Publickey of Storage Account
 * @param {string} url - URL of existing file
 * @param {FormData} data - File data
 * @returns {ShadowUploadResponse} - File location and transaction signature
 */

export default async function editFile(
  key: PublicKey,
  url: string,
  data: FormData
): Promise<ShadowUploadResponse> {
  let fileErrors = [];
  const selectedAccount = await this.program.account.storageAccount.fetch(key);
  const fileBufferString = data.getBuffer().toString("utf-8");
  //Filename parsed from the FormData buffer
  const file = fileBufferString.split('"')[3];

  if (data.getBuffer().buffer.byteLength > 1_073_741_824 * 1) {
    fileErrors.push({
      file: file,
      erorr: "Exceeds the 1GB limit.",
    });
  }
  const fileNameBytes = new TextEncoder().encode(file).length;
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
  hashSum.update(data.getBuffer());
  const sha256Hash = hashSum.digest("hex");
  let size = new anchor.BN(data.getBuffer().buffer.byteLength);
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
    data.append(
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
