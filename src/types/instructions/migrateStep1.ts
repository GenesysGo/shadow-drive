import { web3, BN } from "@coral-xyz/anchor"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId";

export interface MigrateStep1Accounts {
  /** Account to be migrated */
  storageAccount: web3.PublicKey;
  /** Migration helper PDA */
  migration: web3.PublicKey;
  /** User that is migrating */
  owner: web3.PublicKey;
  systemProgram: web3.PublicKey;
}

/**
 * Context: This is user-facing.
 * Function: allows user to top off stake account, and unmarks deletion.
 */
export function migrateStep1(accounts: MigrateStep1Accounts) {
  const keys: Array<web3.AccountMeta> = [
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.migration, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([53, 197, 190, 236, 105, 239, 89, 99]);
  const data = identifier;
  const ix = new web3.TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data,
  });
  return ix;
}
