import { web3, BN } from "@coral-xyz/anchor"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId";

export interface ClaimStake2Accounts {
  /** This is the `StorageConfig` accounts that holds all of the admin, uploader keys. */
  storageConfig: web3.PublicKey;
  /** Parent storage account. Only used here for the key */
  storageAccount: web3.PublicKey;
  /** Account which stores time, epoch last unstaked. Close upon successful unstake. */
  unstakeInfo: web3.PublicKey;
  /** Account which stores SHDW when unstaking.  Close upon successful unstake. */
  unstakeAccount: web3.PublicKey;
  /**
   * File owner, user, fee-payer
   * Requires mutability since owner/user is fee payer.
   */
  owner: web3.PublicKey;
  /**
   * File owner, user, fee-payer
   * Requires mutability since owner/user is fee payer.
   */
  ownerAta: web3.PublicKey;
  /** Token mint account */
  tokenMint: web3.PublicKey;
  /** System Program */
  systemProgram: web3.PublicKey;
  /** Token Programn */
  tokenProgram: web3.PublicKey;
}

/**
 * Context: This is user facing.
 * Function: allows user to claim stake from unstake ticket.
 * Fails if user has not waited an appropriate amount of time.
 */
export function claimStake2(accounts: ClaimStake2Accounts) {
  const keys: Array<web3.AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.unstakeInfo, isSigner: false, isWritable: true },
    { pubkey: accounts.unstakeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.ownerAta, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([219, 42, 186, 26, 91, 182, 115, 63]);
  const data = identifier;
  const ix = new web3.TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data,
  });
  return ix;
}
