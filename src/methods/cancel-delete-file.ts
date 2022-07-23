import * as anchor from "@project-serum/anchor";
import { getStakeAccount, sendAndConfirm } from "../utils/helpers";
import { isBrowser, SHDW_DRIVE_ENDPOINT, tokenMint } from "../utils/common";
import { ShadowDriveResponse } from "../types";
import fetch from "cross-fetch";
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of Storage Account
 * @param {string} url - Shadow Drive URL of the file you are requesting to undelete.
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */

export default async function cancelDeleteFile(
  key: anchor.web3.PublicKey,
  url: string
): Promise<ShadowDriveResponse> {
  const selectedAccount = await this.program.account.storageAccount.fetch(key);
  const fileData = await fetch(`${SHDW_DRIVE_ENDPOINT}/get-object-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      location: url,
    }),
  });
  const fileDataResponse = await fileData.json();
  const fileOwnerOnChain = new anchor.web3.PublicKey(
    fileDataResponse.file_data["owner-account-pubkey"]
  );
  if (!fileOwnerOnChain.equals(this.wallet.publicKey)) {
    return Promise.reject(new Error("Permission denied: Not file owner"));
  }
  const fileAccount = new anchor.web3.PublicKey(
    fileDataResponse.file_data["file-account-pubkey"]
  );
  let stakeAccount = (await getStakeAccount(this.program, key))[0];
  try {
    const txn = await this.program.methods
      .unmarkDeleteFile()
      .accounts({
        storageConfig: this.storageConfigPDA,
        storageAccount: key,
        file: fileAccount,
        stakeAccount,
        owner: selectedAccount.owner1,
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
    const res = await sendAndConfirm(
      this.connection,
      txn.serialize(),
      { skipPreflight: false },
      "confirmed",
      120000
    );
    return Promise.resolve(res);
  } catch (e) {
    return Promise.reject(e);
  }
}
