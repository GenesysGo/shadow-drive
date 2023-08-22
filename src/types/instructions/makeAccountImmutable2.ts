import { web3, BN } from "@coral-xyz/anchor"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId";

export interface MakeAccountImmutable2Args {
  storageUsed: BN;
}

export interface MakeAccountImmutable2Accounts {
  /**
   * This is the `StorageConfig` accounts that holds all of the admin, uploader keys.
   * Requires mutability to update global storage counter.
   */
  storageConfig: web3.PublicKey;
  /**
   * Parent storage account.
   * Requires mutability to update user storage account storage counter.
   */
  storageAccount: web3.PublicKey;
  /** This token account serves as the account which holds user's stake for file storage. */
  stakeAccount: web3.PublicKey;
  /** This token account is the SHDW operator emissions wallet */
  emissionsWallet: web3.PublicKey;
  /**
   * File owner, user, fee-payer
   * Requires mutability since owner/user is fee payer.
   */
  owner: web3.PublicKey;
  /** User's token account */
  ownerAta: web3.PublicKey;
  /** Uploader needs to sign off on make immutable */
  uploader: web3.PublicKey;
  /** Token mint account */
  tokenMint: web3.PublicKey;
  /** System Program */
  systemProgram: web3.PublicKey;
  /** Token Program */
  tokenProgram: web3.PublicKey;
  /** Associated Token Program */
  associatedTokenProgram: web3.PublicKey;
  /** Rent */
  rent: web3.PublicKey;
}

export const layout = borsh.struct([borsh.u64("storageUsed")]);

/**
 * Context: This is user-facing.
 * Function: This marks the corresponding `StorageAccount` account as immutable,
 * and transfers all funds from `stake_account` to operator emissions wallet.
 */
export function makeAccountImmutable2(
  args: MakeAccountImmutable2Args,
  accounts: MakeAccountImmutable2Accounts
) {
  const keys: Array<web3.AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.emissionsWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.ownerAta, isSigner: false, isWritable: true },
    { pubkey: accounts.uploader, isSigner: true, isWritable: false },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([67, 217, 126, 253, 69, 164, 84, 139]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      storageUsed: args.storageUsed,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new web3.TransactionInstruction({
    keys,
    programId: PROGRAM_ID,
    data,
  });
  return ix;
}
