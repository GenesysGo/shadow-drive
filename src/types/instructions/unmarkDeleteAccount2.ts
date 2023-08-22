import { web3, BN } from "@coral-xyz/anchor"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId";

export interface UnmarkDeleteAccount2Accounts {
  /** This is the `StorageConfig` accounts that holds all of the admin, uploader keys. */
  storageConfig: web3.PublicKey;
  /** Parent storage account. */
  storageAccount: web3.PublicKey;
  /** Stake account associated with storage account */
  stakeAccount: web3.PublicKey;
  /**
   * File owner, user, fee-payer
   * Requires mutability since owner/user is fee payer.
   */
  owner: web3.PublicKey;
  /** Token mint account */
  tokenMint: web3.PublicKey;
  /** System Program */
  systemProgram: web3.PublicKey;
}

/**
 * Context: This is user-facing.
 * Function: This updates a boolean flag and resets the request time. Fails if account is marked as immutable.
 */
export function unmarkDeleteAccount2(accounts: UnmarkDeleteAccount2Accounts) {
  const keys: Array<web3.AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([6, 60, 224, 154, 255, 67, 114, 140]);
  const data = identifier;
  const ix = new web3.TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data,
  });
  return ix;
}
