import * as anchor from "@project-serum/anchor";
import { findAssociatedTokenAddress, sendAndConfirm } from "../utils/helpers";
import { isBrowser, tokenMint } from "../utils/common";
import { ShadowDriveResponse } from "../types";

/**
 *
 * @param {anchor.web3.PublicKey} key - PublicKey of a Storage Account
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */

export default async function migrate(
  key: anchor.web3.PublicKey
): Promise<ShadowDriveResponse> {
  const selectedAccount = await this.program.account.storageAccount.fetch(key);

  let [migration, migrationBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("migration-helper"), key.toBytes()],
      this.program.programId
    );

  try {
    let tx = await this.program.methods
      .migrateStep1()
      .accounts({
        storageAccount: key,
        migration: migration,
        owner: selectedAccount.owner1.publicKey,
      })
      .transaction();

    tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
    tx.feePayer = this.wallet.publicKey;
    if (!isBrowser) {
      await tx.partialSign(this.wallet.payer);
    } else {
      await this.wallet.signTransaction(tx);
    }
    await sendAndConfirm(
      this.provider.connection,
      tx.serialize(),
      { skipPreflight: false },
      "confirmed",
      120000
    );
  } catch (err) {
    return Promise.reject(new Error(err));
  }
  let res;
  try {
    let tx2 = await this.program.methods
      .migrateStep2()
      .accounts({
        storageAccount: key,
        migration: migration,
        owner: selectedAccount.owner1.publicKey,
      })
      .transaction();
    tx2.recentBlockhash = (
      await this.connection.getLatestBlockhash()
    ).blockhash;
    tx2.feePayer = this.wallet.publicKey;
    if (!isBrowser) {
      await tx2.partialSign(this.wallet.payer);
    } else {
      await this.wallet.signTransaction(tx2);
    }
    res = await sendAndConfirm(
      this.provider.connection,
      tx2.serialize(),
      { skipPreflight: false },
      "confirmed",
      120000
    );
  } catch (err) {
    return Promise.reject(new Error(err));
  }
  return Promise.resolve(res);
}
