import * as anchor from "@coral-xyz/anchor";
import { getStakeAccount } from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { fromTxError } from "../types/errors";
import { unmarkDeleteAccount2 } from "instructions";
import { StorageAccountV2 } from "accounts";
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of a Storage Account
 * @returns {{ txid: string }} - Confirmed transaction ID
 */

export default async function cancelDeleteStorageAccount(
  key: anchor.web3.PublicKey
): Promise<{ txid: string }> {
  let selectedAccount = await StorageAccountV2.fetch(this.connection, key);

  let stakeAccount = (await getStakeAccount(this.program, key))[0];
  let txn = new anchor.web3.Transaction();
  try {
    const unmarkDeleteAccountIx2 = unmarkDeleteAccount2({
      storageConfig: this.storageConfigPDA,
      storageAccount: key,
      stakeAccount,
      owner: selectedAccount.owner1,
      tokenMint: tokenMint,
      systemProgram: anchor.web3.SystemProgram.programId,
    });
    txn.add(unmarkDeleteAccountIx2);
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
