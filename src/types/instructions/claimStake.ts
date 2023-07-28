import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ClaimStakeAccounts {
  /** This is the `StorageConfig` accounts that holds all of the admin, uploader keys. */
  storageConfig: PublicKey
  /** Parent storage account. Only used here for the key */
  storageAccount: PublicKey
  /** Account which stores time, epoch last unstaked. Close upon successful unstake. */
  unstakeInfo: PublicKey
  /** Account which stores SHDW when unstaking.  Close upon successful unstake. */
  unstakeAccount: PublicKey
  /**
   * File owner, user, fee-payer
   * Requires mutability since owner/user is fee payer.
   */
  owner: PublicKey
  /**
   * File owner, user, fee-payer
   * Requires mutability since owner/user is fee payer.
   */
  ownerAta: PublicKey
  /** Token mint account */
  tokenMint: PublicKey
  /** System Program */
  systemProgram: PublicKey
  /** Token Programn */
  tokenProgram: PublicKey
}

/**
 * Context: This is user facing.
 * Function: allows user to claim stake from unstake ticket.
 * Fails if user has not waited an appropriate amount of time.
 */
export function claimStake(accounts: ClaimStakeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.unstakeInfo, isSigner: false, isWritable: true },
    { pubkey: accounts.unstakeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.ownerAta, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([62, 145, 133, 242, 244, 59, 53, 139])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
