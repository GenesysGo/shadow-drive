import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface IncreaseImmutableStorageArgs {
  additionalStorage: BN
}

export interface IncreaseImmutableStorageAccounts {
  /** This is the `StorageConfig` accounts that holds all of the admin, uploader keys. */
  storageConfig: PublicKey
  /** Parent storage account. */
  storageAccount: PublicKey
  /** Wallet that receives storage fees */
  emissionsWallet: PublicKey
  /**
   * File owner, user, fee-payer
   * Requires mutability since owner/user is fee payer.
   */
  owner: PublicKey
  /** This is the user's token account with which they are staking */
  ownerAta: PublicKey
  /** Uploader needs to sign off on increase storage */
  uploader: PublicKey
  /** Token mint account */
  tokenMint: PublicKey
  /** System Program */
  systemProgram: PublicKey
  /** Token Program */
  tokenProgram: PublicKey
}

export const layout = borsh.struct([borsh.u64("additionalStorage")])

/**
 * Context: This is user facing.
 * Function: allows user to pay for more storage at current rate, after having marked an account as immutable
 */
export function increaseImmutableStorage(
  args: IncreaseImmutableStorageArgs,
  accounts: IncreaseImmutableStorageAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.emissionsWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.ownerAta, isSigner: false, isWritable: true },
    { pubkey: accounts.uploader, isSigner: true, isWritable: false },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([15, 242, 154, 6, 214, 53, 252, 36])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      additionalStorage: args.additionalStorage,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
