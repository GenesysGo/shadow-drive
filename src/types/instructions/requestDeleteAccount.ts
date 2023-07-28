import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RequestDeleteAccountAccounts {
  /** This is the `StorageConfig` accounts that holds all of the admin, uploader keys. */
  storageConfig: PublicKey
  /** Parent storage account. */
  storageAccount: PublicKey
  /**
   * File owner, user, fee-payer
   * Requires mutability since owner/user is fee payer.
   */
  owner: PublicKey
  /** Token mint account */
  tokenMint: PublicKey
  /** System Program */
  systemProgram: PublicKey
}

/**
 * Context: This is user-facing. This is to be done after our upload server verifies all is well.
 * Function: This stores the file metadata + location on-chain.
 * Context: This is user-facing, but requires our uploader's signature. This is to be done after our upload server verifies all is well.
 * Function: This updates the file metadata on-chain upon user edits.
 * Context: This is user-facing.
 * Function: This updates a boolean flag and records the request time. Fails if parent account is marked as immutable.
 * Context: This is user-facing.
 * Function: This updates a boolean flag and records the request time. Fails if account is marked as immutable.
 */
export function requestDeleteAccount(accounts: RequestDeleteAccountAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([223, 4, 76, 243, 237, 193, 231, 46])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
