import * as anchor from "@coral-xyz/anchor";
import {
  getStakeAccount,
  findAssociatedTokenAddress,
  sendAndConfirm,
} from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ShadowDriveVersion } from "../types";
/**
 *
 * @param {anchor.web3.PublicKey} key - Public Key of the existing storage to increase size on
 * @param {ShadowDriveVersion} version - ShadowDrive version (v1 or v2)
 *
 *  @returns {txid: string} - confirmed transaction id
 */
export default async function refreshStake(
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
  const stakeAccount = (await getStakeAccount(this.program, key))[0];
  const ownerAta = await findAssociatedTokenAddress(
    this.wallet.publicKey,
    tokenMint
  );
  let txn;
  try {
    switch (version.toLocaleLowerCase()) {
      case "v1":
        txn = await this.program.methods
          .refreshStake()
          .accounts({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            owner: selectedAccount.owner1,
            ownerAta: ownerAta,
            stakeAccount: stakeAccount,
            tokenMint: tokenMint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .transaction();
        break;
      case "v2":
        txn = await this.program.methods
          .refreshStake2()
          .accounts({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            owner: selectedAccount.owner1,
            ownerAta: ownerAta,
            stakeAccount: stakeAccount,
            tokenMint: tokenMint,
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
