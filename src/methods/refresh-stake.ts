import * as anchor from "@coral-xyz/anchor";
import { getStakeAccount, findAssociatedTokenAddress } from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ShadowDriveVersion } from "../types";
import { fromTxError } from "../types/errors";
import { refreshStake2, refreshStake as refresh } from "instructions";
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
  let txn = new anchor.web3.Transaction();
  try {
    switch (version.toLocaleLowerCase()) {
      case "v1":
        const refreshStakeIx = refresh({
          storageConfig: this.storageConfigPDA,
          storageAccount: key,
          owner: selectedAccount.owner1,
          ownerAta: ownerAta,
          stakeAccount: stakeAccount,
          tokenMint: tokenMint,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        });
        txn.add(refreshStakeIx);
        break;
      case "v2":
        const refreshStakeIx2 = refreshStake2({
          storageConfig: this.storageConfigPDA,
          storageAccount: key,
          owner: selectedAccount.owner1,
          ownerAta: ownerAta,
          stakeAccount: stakeAccount,
          tokenMint: tokenMint,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        });
        txn.add(refreshStakeIx2);
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
      return Promise.reject(new Error(parsedError.message));
    } else {
      return Promise.reject(new Error(e));
    }
  }
}
