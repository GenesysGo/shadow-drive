import * as anchor from "@project-serum/anchor";
import { sendAndConfirm } from "../utils/helpers";
import { isBrowser } from "../utils/common";

/**
 *
 * @param {anchor.web3.PublicKey} key - PublicKey of a Storage Account
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */

export default async function migrate(
  key: anchor.web3.PublicKey
): Promise<{ txid: string }> {
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
    const signedTx = await this.wallet.signTransaction(tx);

    await sendAndConfirm(
      this.connection,
      signedTx.serialize(),
      { skipPreflight: false },
      "max",
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
    let signedTx = await this.wallet.signTransaction(tx2);
    res = await sendAndConfirm(
      this.connection,
      signedTx.serialize(),
      { skipPreflight: true },
      "confirmed",
      120000
    );
  } catch (err) {
    return Promise.reject(new Error(err));
  }
  return Promise.resolve(res);
}
