import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DecreaseStorage2Args {
  removeStorage: BN
  storageUsed: BN
}

export interface DecreaseStorage2Accounts {
  /** This is the `StorageConfig` accounts that holds all of the admin, uploader keys. */
  storageConfig: PublicKey
  /** Parent storage account. */
  storageAccount: PublicKey
  /** Account which stores time, epoch last unstaked */
  unstakeInfo: PublicKey
  /** Account which stores SHDW when unstaking */
  unstakeAccount: PublicKey
  /**
   * File owner, user, fee-payer
   * Requires mutability since owner/user is fee payer.
   */
  owner: PublicKey
  /** User's ATA */
  ownerAta: PublicKey
  /** This token account serves as the account which holds user's stake for file storage. */
  stakeAccount: PublicKey
  /** Token mint account */
  tokenMint: PublicKey
  /** Uploader needs to sign off on decrease storage */
  uploader: PublicKey
  /** Token account holding operator emission funds */
  emissionsWallet: PublicKey
  /** System Program */
  systemProgram: PublicKey
  /** Token Program */
  tokenProgram: PublicKey
  /** Rent Program */
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("removeStorage"),
  borsh.u64("storageUsed"),
])

/**
 * Context: This is user facing.
 * Function: allows user to reduce storage, up to current available storage,
 * and begins an unstake ticket.
 */
export function decreaseStorage2(
  args: DecreaseStorage2Args,
  accounts: DecreaseStorage2Accounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.unstakeInfo, isSigner: false, isWritable: true },
    { pubkey: accounts.unstakeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.ownerAta, isSigner: false, isWritable: true },
    { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: true },
    { pubkey: accounts.uploader, isSigner: true, isWritable: false },
    { pubkey: accounts.emissionsWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([24, 37, 133, 195, 45, 197, 190, 175])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      removeStorage: args.removeStorage,
      storageUsed: args.storageUsed,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
