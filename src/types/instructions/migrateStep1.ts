import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MigrateStep1Accounts {
  /** Account to be migrated */
  storageAccount: PublicKey
  /** Migration helper PDA */
  migration: PublicKey
  /** User that is migrating */
  owner: PublicKey
  systemProgram: PublicKey
}

/**
 * Context: This is user-facing.
 * Function: allows user to top off stake account, and unmarks deletion.
 */
export function migrateStep1(accounts: MigrateStep1Accounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.migration, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([53, 197, 190, 236, 105, 239, 89, 99])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
