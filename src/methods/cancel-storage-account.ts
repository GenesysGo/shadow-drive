import * as anchor from "@coral-xyz/anchor";
import { getStakeAccount } from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { ShadowDriveVersion } from "../types";
import { fromTxError } from "../types/errors";
import { unmarkDeleteAccount, unmarkDeleteAccount2 } from "instructions";
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
  let txn = new anchor.web3.Transaction();
  try {
    switch (version.toLocaleLowerCase()) {
      case "v1":
        const unmarkDeleteAccountIx = unmarkDeleteAccount({
          storageConfig: this.storageConfigPDA,
          storageAccount: key,
          stakeAccount,
          owner: selectedAccount.owner1,
          tokenMint: tokenMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        });
        txn.add(unmarkDeleteAccountIx);
        break;
      case "v2":
        const unmarkDeleteAccountIx2 = unmarkDeleteAccount2({
          storageConfig: this.storageConfigPDA,
          storageAccount: key,
          stakeAccount,
          owner: selectedAccount.owner1,
          tokenMint: tokenMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        });
        txn.add(unmarkDeleteAccountIx2);
        break;
    }
    let blockInfo = await this.connection.getLatestBlockhash();
    txn.recentBlockhash = blockInfo.blockhash;
    txn.feePayer = this.wallet.publicKey;
    const signedTx = await this.wallet.signTransaction(txn);
    const res = await anchor.web3.sendAndConfirmRawTransaction(
      this.connection,
      signedTx.serialize(),
      { skipPreflight: false, commitment: "confirmed" }
    );
    return Promise.resolve({ txid: res });
  } catch (e) {
    const parsedError = fromTxError(e);
    if (parsedError !== null) {
      return Promise.reject(new Error(parsedError.msg));
    } else {
      return Promise.reject(new Error(e));
    }
  }
}
