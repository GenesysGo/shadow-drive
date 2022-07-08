import * as anchor from "@project-serum/anchor";
import { findAssociatedTokenAddress, sendAndConfirm } from "../utils/helpers";
import { isBrowser, tokenMint } from "../utils/common";
import { ShadowDriveResponse } from "../types";

/**
 *
 * @param {anchor.web3.PublicKey} key - PublicKey of a Storage Account
 * @param {anchor.web3.PublicKey} fileAccount - PublicKey of the file account to close
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */

export default async function redeemRent(
  key: anchor.web3.PublicKey,
  fileAccount: anchor.web3.PublicKey
): Promise<ShadowDriveResponse> {
  let selectedAccount;

  selectedAccount = await this.program.account.storageAccount.fetch(key);
  try {
    const txn = await this.program.methods
      .redeemRent()
      .accounts({
        storageAccount: key,
        file: fileAccount,
        owner: selectedAccount.owner1,
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
      this.provider.connection,
      txn.serialize(),
      { skipPreflight: false },
      "confirmed",
      120000
    );
    return Promise.resolve(res);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
