import * as anchor from "@project-serum/anchor";
import { getStakeAccount, sendAndConfirm } from "../utils/helpers";
import { isBrowser, tokenMint } from "../utils/common";
import { ShadowDriveResponse } from "../types";
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of a Storage Account
 *
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */

export default async function cancelDeleteStorageAccount(
  key: anchor.web3.PublicKey
): Promise<ShadowDriveResponse> {
  const selectedAccount = await this.program.account.storageAccount.fetch(key);
  let stakeAccount = (await getStakeAccount(this.program, key))[0];
  try {
    const txn = await this.program.methods
      .unmarkDeleteAccount()
      .accounts({
        storageConfig: this.storageConfigPDA,
        storageAccount: key,
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
