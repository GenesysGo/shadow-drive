import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MigrateStep2Accounts {
  /** New account */
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
export function migrateStep2(accounts: MigrateStep2Accounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.migration, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([236, 176, 21, 180, 127, 73, 184, 61])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
