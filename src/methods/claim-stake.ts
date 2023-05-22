import * as anchor from "@coral-xyz/anchor";
import { findAssociatedTokenAddress, sendAndConfirm } from "../utils/helpers";
import { isBrowser, tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ShadowDriveVersion } from "../types";

/**
 *
 * @param {anchor.web3.PublicKey} key - PublicKey of a Storage Account
 * @param {ShadowDriveVersion} version - ShadowDrive version (v1 or v2)
 * @returns {{ txid: string }} - Confirmed transaction ID
 */

export default async function claimStake(
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
  let txn;
  try {
    switch (version.toLocaleLowerCase()) {
      case "v1":
        txn = await this.program.methods
          .claimStake()
          .accounts({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            unstakeInfo: unstakeInfo,
            unstakeAccount: unstakeAccount,
            owner: selectedAccount.owner1,
            ownerAta,
            tokenMint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .transaction();
        break;
      case "v2":
        txn = await this.program.methods
          .claimStake2()
          .accounts({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            unstakeInfo: unstakeInfo,
            unstakeAccount: unstakeAccount,
            owner: selectedAccount.owner1,
            ownerAta,
            tokenMint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .transaction();
        break;
    }
    txn.recentBlockhash = (
      await this.connection.getLatestBlockhash()
    ).blockhash;
    txn.feePayer = this.wallet.publicKey;
    const signedTx = await this.wallet.signTransaction(txn);

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
