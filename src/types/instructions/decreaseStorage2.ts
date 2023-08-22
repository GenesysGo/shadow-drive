import { web3, BN } from "@coral-xyz/anchor"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId";

export interface DecreaseStorage2Args {
  removeStorage: BN;
  storageUsed: BN;
}

export interface DecreaseStorage2Accounts {
  /** This is the `StorageConfig` accounts that holds all of the admin, uploader keys. */
  storageConfig: web3.PublicKey;
  /** Parent storage account. */
  storageAccount: web3.PublicKey;
  /** Account which stores time, epoch last unstaked */
  unstakeInfo: web3.PublicKey;
  /** Account which stores SHDW when unstaking */
  unstakeAccount: web3.PublicKey;
  /**
   * File owner, user, fee-payer
   * Requires mutability since owner/user is fee payer.
   */
  owner: web3.PublicKey;
  /** User's ATA */
  ownerAta: web3.PublicKey;
  /** This token account serves as the account which holds user's stake for file storage. */
  stakeAccount: web3.PublicKey;
  /** Token mint account */
  tokenMint: web3.PublicKey;
  /** Uploader needs to sign off on decrease storage */
  uploader: web3.PublicKey;
  /** Token account holding operator emission funds */
  emissionsWallet: web3.PublicKey;
  /** System Program */
  systemProgram: web3.PublicKey;
  /** Token Program */
  tokenProgram: web3.PublicKey;
  /** Rent Program */
  rent: web3.PublicKey;
}

export const layout = borsh.struct([
  borsh.u64("removeStorage"),
  borsh.u64("storageUsed"),
]);

/**
 * Context: This is user facing.
 * Function: allows user to reduce storage, up to current available storage,
 * and begins an unstake ticket.
 */
export function decreaseStorage2(
  args: DecreaseStorage2Args,
  accounts: DecreaseStorage2Accounts
) {
  const keys: Array<web3.AccountMeta> = [
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
  ];
  const identifier = Buffer.from([24, 37, 133, 195, 45, 197, 190, 175]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      removeStorage: args.removeStorage,
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
