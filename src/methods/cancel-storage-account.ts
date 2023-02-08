import * as anchor from "@project-serum/anchor";
import { getStakeAccount, sendAndConfirm } from "../utils/helpers";
import { isBrowser, tokenMint } from "../utils/common";
import { ShadowDriveVersion } from "../types";
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of a Storage Account
 * @param {ShadowDriveVersion} version - ShadowDrive version (v1 or v2)
 * @returns {{ txid: string }} - Confirmed transaction ID
 */

export default async function cancelDeleteStorageAccount(
  key: anchor.web3.PublicKey,
  version: ShadowDriveVersion
): Promise<{ txid: string }> {
  let selectedAccount;
  switch (version.toLocaleLowerCase()) {
    case "v1":
      selectedAccount = await this.program.account.storageAccount.fetch(key);
      break;
    case "v2":
      selectedAccount = await this.program.account.storageAccountV2.fetch(key);
      break;
  }
  let stakeAccount = (await getStakeAccount(this.program, key))[0];
  let txn;
  try {
    switch (version.toLocaleLowerCase()) {
      case "v1":
        txn = await this.program.methods
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
        break;
      case "v2":
        txn = await this.program.methods
          .unmarkDeleteAccount2()
          .accounts({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            stakeAccount,
            owner: selectedAccount.owner1,
            tokenMint: tokenMint,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .transaction();
        break;
    }
    txn.recentBlockhash = (
      await this.connection.getLatestBlockhash()
    ).blockhash;
    txn.feePayer = this.wallet.publicKey;
    let signedTx;
    if (!isBrowser) {
      signedTx = await txn.partialSign(this.wallet.payer);
    } else {
      signedTx = await this.wallet.signTransaction(txn);
    }

    const res = await sendAndConfirm(
      this.connection,
      signedTx.serialize(),
      { skipPreflight: false },
      "confirmed",
      120000
    );
    return Promise.resolve(res);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
