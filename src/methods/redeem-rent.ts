import * as anchor from "@coral-xyz/anchor";
import { findAssociatedTokenAddress, sendAndConfirm } from "../utils/helpers";
import { isBrowser, tokenMint } from "../utils/common";

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
    let signedTx = await this.wallet.signTransaction(txn);
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
