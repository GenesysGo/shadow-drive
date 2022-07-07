import * as anchor from "@project-serum/anchor";
import { findAssociatedTokenAddress, sendAndConfirm } from "../utils/helpers";
import { isBrowser, tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ShadowDriveResponse } from "../types";

/**
 *
 * @param {anchor.web3.PublicKey} key - PublicKey of a Storage Account
 * @param {string} file - ShadowDrive version (v1 or v2)
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */

export default async function redeemRent(
  key: anchor.web3.PublicKey,
  file: string
): Promise<ShadowDriveResponse> {
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
        file: file,
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
