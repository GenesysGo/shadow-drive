import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UnmarkDeleteAccountAccounts {
  /** This is the `StorageConfig` accounts that holds all of the admin, uploader keys. */
  storageConfig: PublicKey
  /** Parent storage account. */
  storageAccount: PublicKey
  /** Stake account associated with storage account */
  stakeAccount: PublicKey
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
 * Context: This is user-facing.
 * Function: This updates a boolean flag and resets the request time. Fails if parent account is marked as immutable.
 * Context: This is user-facing.
 * Function: This updates a boolean flag and resets the request time. Fails if account is marked as immutable.
 */
export function unmarkDeleteAccount(accounts: UnmarkDeleteAccountAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([95, 27, 216, 87, 94, 97, 212, 183])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
