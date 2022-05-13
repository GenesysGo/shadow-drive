import * as anchor from "@project-serum/anchor";
import {
  humanSizeToBytes,
  getStakeAccount,
  findAssociatedTokenAddress,
} from "../utils/helpers";
import { isBrowser, tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { sendAndConfirmWithRetry } from "@strata-foundation/spl-utils";
import { PublicKey } from "@solana/web3.js";
import { ShadowDriveResponse } from "../types";
/**
 *
 * @param {PublicKey} key - Public Key of the existing storage to increase size on
 * @param {string} size - Amount of storage you are requesting to add to your storage account. Should be in a string like '1KB', '1MB', '1GB'. Only KB, MB, and GB storage delineations are supported currently.
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */

export default async function addStorage(
  key: PublicKey,
  size: string
): Promise<ShadowDriveResponse> {
  let storageInputAsBytes = humanSizeToBytes(size);
  if (storageInputAsBytes === false) {
    return Promise.reject(
      new Error(
        `${size} is not a valid input for size. Please use a string like '1KB', '1MB', '1GB'.`
      )
    );
  }
  let userInfoAccount = await this.connection.getAccountInfo(this.userInfo);
  let userInfoData;
  let accountSeed;
  if (userInfoAccount !== null) {
    userInfoData = await this.program.account.userInfo.fetch(this.userInfo);
    accountSeed = new anchor.BN(userInfoData.accountCounter);
  } else {
    return Promise.reject(
      new Error(
        "You have not created a storage account on Shadow Drive yet. Please see the 'create-storage-account' command to get started."
      )
    );
  }
  const selectedAccount = await this.program.account.storageAccount.fetch(key);
  const ownerAta = await findAssociatedTokenAddress(
    selectedAccount.owner1,
    tokenMint
  );
  let stakeAccount = (await getStakeAccount(this.program, key))[0];

  try {
    const txn = await this.program.methods
      .increaseStorage(new anchor.BN(storageInputAsBytes.toString()))
      .accounts({
        storageConfig: this.storageConfigPDA,
        storageAccount: key,
        owner: selectedAccount.owner1,
        ownerAta,
        stakeAccount,
        tokenMint: tokenMint,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
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
    const res = await sendAndConfirmWithRetry(
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
