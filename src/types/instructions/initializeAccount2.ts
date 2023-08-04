import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeAccount2Args {
  identifier: string
  storage: BN
}

export interface InitializeAccount2Accounts {
  /** This account is a PDA that holds the storage configuration, including current cost per byte, */
  storageConfig: PublicKey
  /** This account is a PDA that holds a user's info (not specific to one storage account). */
  userInfo: PublicKey
  /**
   * This account is a PDA that holds a user's storage account information.
   * Upgraded to `StorageAccountV2`.
   */
  storageAccount: PublicKey
  /** This token account serves as the account which holds user's stake for file storage. */
  stakeAccount: PublicKey
  /** This is the token in question for staking. */
  tokenMint: PublicKey
  /**
   * This is the user who is initializing the storage account
   * and is automatically added as an admin
   */
  owner1: PublicKey
  /**
   * Uploader needs to sign as this txn
   * needs to be fulfilled on the middleman server
   * to create the ceph bucket
   */
  uploader: PublicKey
  /** This is the user's token account with which they are staking */
  owner1TokenAccount: PublicKey
  /** System Program */
  systemProgram: PublicKey
  /** Token Program */
  tokenProgram: PublicKey
  /** Rent Program */
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.str("identifier"),
  borsh.u64("storage"),
])

/**
 * Context: This is user-facing. This is to be done whenever the user decides.
 * Function: This allows the user to initialize a storage account with some specified number of bytes.
 */
export function initializeAccount2(
  args: InitializeAccount2Args,
  accounts: InitializeAccount2Accounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.userInfo, isSigner: false, isWritable: true },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.owner1, isSigner: true, isWritable: true },
    { pubkey: accounts.uploader, isSigner: true, isWritable: false },
    { pubkey: accounts.owner1TokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([8, 182, 149, 144, 185, 31, 209, 105])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      identifier: args.identifier,
      storage: args.storage,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
