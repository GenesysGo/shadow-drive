import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RefreshStake2Accounts {
  /** This is the `StorageConfig` accounts that holds all of the admin, uploader keys. */
  storageConfig: PublicKey
  /** Parent storage account. */
  storageAccount: PublicKey
  /**
   * File owner, user, fee-payer
   * Requires mutability since owner/user is fee payer.
   */
  owner: PublicKey
  /** This is the user's token account with which they are staking */
  ownerAta: PublicKey
  /** This token account serves as the account which holds user's stake for file storage. */
  stakeAccount: PublicKey
  /** Token mint account */
  tokenMint: PublicKey
  /** System Program */
  systemProgram: PublicKey
  /** Token Program */
  tokenProgram: PublicKey
}

/**
 * Context: This is user-facing.
 * Function: allows user to top off stake account, and unmarks deletion.
 */
export function refreshStake2(accounts: RefreshStake2Accounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.ownerAta, isSigner: false, isWritable: true },
    { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([184, 185, 15, 101, 172, 46, 252, 56])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
