import * as anchor from "@coral-xyz/anchor";
import { findAssociatedTokenAddress } from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ShadowDriveVersion } from "../types";
import { fromTxError } from "../types/errors";
import { claimStake2, claimStake as claim } from "instructions";

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
  let txn = new anchor.web3.Transaction();
  try {
    switch (version.toLocaleLowerCase()) {
      case "v1":
        const claimStakeIx = claim({
          storageConfig: this.storageConfigPDA,
          storageAccount: key,
          unstakeInfo: unstakeInfo,
          unstakeAccount: unstakeAccount,
          owner: selectedAccount.owner1,
          ownerAta,
          tokenMint,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        });
        txn.add(claimStakeIx);
        break;
      case "v2":
        const claimStakeIx2 = claimStake2({
          storageConfig: this.storageConfigPDA,
          storageAccount: key,
          unstakeInfo: unstakeInfo,
          unstakeAccount: unstakeAccount,
          owner: selectedAccount.owner1,
          ownerAta,
          tokenMint,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        });
        txn.add(claimStakeIx2);
        break;
    }
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
