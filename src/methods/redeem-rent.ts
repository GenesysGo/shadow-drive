import * as anchor from "@coral-xyz/anchor";
import { findAssociatedTokenAddress } from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { fromTxError } from "../types/errors";
import { redeemRent as redeem } from "instructions";
/**
 *
 * @param {anchor.web3.PublicKey} key - PublicKey of a Storage Account
 * @param {anchor.web3.PublicKey} fileAccount - PublicKey of the file account to close
 * @returns {{ txid: string }} - Confirmed transaction ID
 */

export default async function redeemRent(
  key: anchor.web3.PublicKey,
  fileAccount: anchor.web3.PublicKey
): Promise<{ txid: string }> {
  let selectedAccount;

  selectedAccount = await this.program.account.storageAccount.fetch(key);
  const [unstakeAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("unstake-account"), key.toBytes()],
    this.program.programId
  );
  const [unstakeInfo] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("unstake-info"), key.toBytes()],
    this.program.programId
  );
  const ownerAta = await findAssociatedTokenAddress(
    selectedAccount.owner1,
    tokenMint
  );
  try {
    let txn = new anchor.web3.Transaction();
    const redeemRentIx = redeem({
      storageAccount: key,
      file: fileAccount,
      owner: selectedAccount.owner1,
    });
    txn.add(redeemRentIx);
    let blockInfo = await this.connection.getLatestBlockhash();
    txn.recentBlockhash = blockInfo.blockhash;
    txn.feePayer = this.wallet.publicKey;
    const signedTx = await this.wallet.signTransaction(txn);
    const res = await anchor.web3.sendAndConfirmRawTransaction(
      this.connection,
      signedTx.serialize(),
      { skipPreflight: true, commitment: "confirmed" }
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
