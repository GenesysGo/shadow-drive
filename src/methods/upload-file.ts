import * as anchor from "@project-serum/anchor";
import {
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
  tokenMint,
  uploader,
} from "../utils/common";
import FormData from "form-data";
import crypto from "crypto";
import { PublicKey } from "@solana/web3.js";
import fetch from "node-fetch";
import { ShadowUploadResponse } from "../types";
/**
 *
 * @param {PublicKey} key - Publickey of Storage Account
 * @param {FormData} data - FormData for the file to upload
 *
 * @returns {ShadowUploadResponse} - File location and transaction signature
 */

export default async function uploadFile(
  key: PublicKey,
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
  const hashSum = crypto.createHash("sha256");
  hashSum.update(data.getBuffer());
  const sha256Hash = hashSum.digest("hex");

  let size = new anchor.BN(data.getBuffer().buffer.byteLength);
  let fileSeed = selectedAccount.initCounter;
  const url = encodeURI(`${SHDW_DRIVE_ENDPOINT}/${key.toString()}/${file}`);

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
      .storeFile(file, sha256Hash, size)
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
    data.append(
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
      body: data,
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
