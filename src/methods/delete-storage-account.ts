import * as anchor from "@coral-xyz/anchor";
import { tokenMint } from "../utils/common";
import { ShadowDriveVersion } from "../types";
import { fromTxError } from "../types/errors";
import { requestDeleteAccount, requestDeleteAccount2 } from "instructions";

/**
 *
 * @param {anchor.web3.PublicKey} key - PublicKey of a StorageAccount
 *	@param {ShadowDriveVersion} version - ShadowDrive (v1 or v2)
 * @returns {{ txid: string }} - Confirmed transaction ID
 */

export default async function deleteStorageAccount(
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
  try {
    let txn = new anchor.web3.Transaction();
    switch (version.toLocaleLowerCase()) {
      case "v1":
        const reqDeleteAccountIx = requestDeleteAccount({
          storageConfig: this.storageConfigPDA,
          storageAccount: key,
          owner: selectedAccount.owner1,
          tokenMint: tokenMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        });
        txn.add(reqDeleteAccountIx);
      case "v2":
        const reqDeleteAccountIx2 = requestDeleteAccount2({
          storageConfig: this.storageConfigPDA,
          storageAccount: key,
          owner: selectedAccount.owner1,
          tokenMint: tokenMint,
          systemProgram: anchor.web3.SystemProgram.programId,
        });
        txn.add(reqDeleteAccountIx2);
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
