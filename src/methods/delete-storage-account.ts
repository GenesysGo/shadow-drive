import * as anchor from "@coral-xyz/anchor";
import { tokenMint } from "../utils/common";
import { fromTxError } from "../types/errors";
import { requestDeleteAccount2 } from "../types/instructions";
import { StorageAccountV2 } from "../types/accounts";

/**
 *
 * @param {anchor.web3.PublicKey} key - PublicKey of a StorageAccount
 * @returns {{ txid: string }} - Confirmed transaction ID
 */

export default async function deleteStorageAccount(
  key: anchor.web3.PublicKey
): Promise<{ txid: string }> {
  let selectedAccount = await StorageAccountV2.fetch(this.connection, key);
  try {
    let txn = new anchor.web3.Transaction();
    const reqDeleteAccountIx2 = requestDeleteAccount2({
      storageConfig: this.storageConfigPDA,
      storageAccount: key,
      owner: selectedAccount.owner1,
      tokenMint: tokenMint,
      systemProgram: anchor.web3.SystemProgram.programId,
    });
    txn.add(reqDeleteAccountIx2);
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
      return Promise.reject(new Error(e.message));
    }
  }
}
