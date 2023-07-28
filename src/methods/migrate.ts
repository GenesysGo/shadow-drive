import * as anchor from "@coral-xyz/anchor";
import { fromTxError } from "../types/errors";
import { migrateStep1, migrateStep2 } from "instructions";
import { StorageAccount } from "accounts";

/**
 *
 * @param {anchor.web3.PublicKey} key - PublicKey of a Storage Account
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */

export default async function migrate(
  key: anchor.web3.PublicKey
): Promise<{ step1_sig: string; step2_sig: string }> {
  const selectedAccount = await StorageAccount.fetch(this.connection, key);

  let [migration, migrationBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("migration-helper"), key.toBytes()],
      this.program.programId
    );
  let step1Res;
  try {
    let tx = new anchor.web3.Transaction();
    const migrateIx = migrateStep1({
      storageAccount: key,
      migration: migration,
      owner: selectedAccount.owner1,
      systemProgram: anchor.web3.SystemProgram.programId,
    });
    tx.add(migrateIx);

    let blockInfo = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockInfo.blockhash;
    tx.feePayer = this.wallet.publicKey;
    const signedTx = await this.wallet.signTransaction(tx);
    step1Res = await anchor.web3.sendAndConfirmRawTransaction(
      this.connection,
      signedTx.serialize(),
      { skipPreflight: false, commitment: "confirmed" }
    );
  } catch (err) {
    const parsedError = fromTxError(err);
    if (parsedError !== null) {
      return Promise.reject(new Error(parsedError.msg));
    } else {
      return Promise.reject(new Error(err));
    }
  }
  let step2Res;
  try {
    let tx2 = new anchor.web3.Transaction();
    const migrate2Ix = migrateStep2({
      storageAccount: key,
      migration: migration,
      owner: selectedAccount.owner1,
      systemProgram: anchor.web3.SystemProgram.programId,
    });
    tx2.add(migrate2Ix);
    let blockInfo = await this.connection.getLatestBlockhash();
    tx2.recentBlockhash = blockInfo.blockhash;
    tx2.feePayer = this.wallet.publicKey;
    const signedTx = await this.wallet.signTransaction(tx2);
    step2Res = await anchor.web3.sendAndConfirmRawTransaction(
      this.connection,
      signedTx.serialize(),
      { skipPreflight: false, commitment: "confirmed" }
    );
  } catch (err) {
    const parsedError = fromTxError(err);
    if (parsedError !== null) {
      return Promise.reject(new Error(parsedError.msg));
    } else {
      return Promise.reject(new Error(err));
    }
  }
  return Promise.resolve({ step1_sig: step1Res, step2_sig: step2Res });
}
