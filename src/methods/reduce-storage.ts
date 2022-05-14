import * as anchor from "@project-serum/anchor";
import {
  humanSizeToBytes,
  getStakeAccount,
  findAssociatedTokenAddress,
  sendAndConfirm,
} from "../utils/helpers";
import { emissions, isBrowser, tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { ShadowDriveResponse } from "../types";

/**
 *
 * @param {PublicKey} key - Publickey of a Storage Account
 * @param {string} size - Amount of storage you are requesting to reduce from your storage account. Should be in a string like '1KB', '1MB', '1GB'. Only KB, MB, and GB storage delineations are supported currently.
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */
export default async function reduceStorage(
  key: PublicKey,
  size: string
): Promise<ShadowDriveResponse> {
  let storageInputAsBytes = humanSizeToBytes(size);
  const selectedAccount = await this.program.account.storageAccount.fetch(key);
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
  let stakeAccount = (await getStakeAccount(this.program, key))[0];
  const emissionsAta = await findAssociatedTokenAddress(emissions, tokenMint);
  try {
    const txn = await this.program.methods
      .decreaseStorage(new anchor.BN(storageInputAsBytes.toString()))
      .accounts({
        storageConfig: this.storageConfigPDA,
        storageAccount: key,
        unstakeInfo,
        unstakeAccount,
        owner: selectedAccount.owner1,
        ownerAta,
        stakeAccount,
        emissionsWallet: emissionsAta,
        tokenMint: tokenMint,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
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
