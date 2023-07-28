import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RedeemRentAccounts {
  /** Parent storage account. */
  storageAccount: PublicKey
  /** File account to be closed */
  file: PublicKey
  /** File owner, user */
  owner: PublicKey
}

/**
 * Context: This is for admin use.
 * Function: This deletes the corresponding `File` account and updates storage available in user's storage account.
 * Fails if file is marked as immutable, or if time elapsed since request is less than the grace period.
 * Context: This is user-facing.
 * Function: This deletes the corresponding `File` account, allowing user to redeem SOL rent in v1.5
 */
export function redeemRent(accounts: RedeemRentAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: false },
    { pubkey: accounts.file, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
  ]
  const identifier = Buffer.from([33, 167, 14, 147, 153, 140, 217, 144])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
