import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DeleteAccount2Args {
  storageUsed: BN
}

export interface DeleteAccount2Accounts {
  /** This is the `StorageConfig` accounts that holds all of the admin, uploader keys. */
  storageConfig: PublicKey
  /** This account is a PDA that holds a user's info (not specific to one storage account). */
  userInfo: PublicKey
  /** Parent storage account. */
  storageAccount: PublicKey
  /** This token account serves as the account which holds user's stake for file storage. */
  stakeAccount: PublicKey
  /**
   * File owner, user
   * Also, our uploader keys are signing this transaction so presuamably we would only provide a good key.
   * We also may not need this account at all.
   */
  owner: PublicKey
  /** This is the user's token account, presumably with which they staked */
  shdwPayer: PublicKey
  /** Admin/uploader */
  uploader: PublicKey
  /** This token accountis the SHDW operator emissions wallet */
  emissionsWallet: PublicKey
  /** Token mint account */
  tokenMint: PublicKey
  /** System Program */
  systemProgram: PublicKey
  /** Token Program */
  tokenProgram: PublicKey
}

export const layout = borsh.struct([borsh.u64("storageUsed")])

/**
 * Context: This is for admin use.
 * Function: This deletes the corresponding `StorageAccount` account and return's user funds.
 * Fails if file is marked as immutable, or if time elapsed since request is less than the grace period.
 */
export function deleteAccount2(
  args: DeleteAccount2Args,
  accounts: DeleteAccount2Accounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.userInfo, isSigner: false, isWritable: true },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: false, isWritable: true },
    { pubkey: accounts.shdwPayer, isSigner: false, isWritable: true },
    { pubkey: accounts.uploader, isSigner: true, isWritable: false },
    { pubkey: accounts.emissionsWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([102, 22, 243, 60, 222, 75, 121, 172])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      storageUsed: args.storageUsed,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
