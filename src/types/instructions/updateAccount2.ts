import { web3, BN } from "@coral-xyz/anchor"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId";

export interface UpdateAccount2Args {
  identifier: string | null;
}

export interface UpdateAccount2Accounts {
  /** This is the `StorageConfig` accounts that holds all of the admin, uploader keys. */
  storageConfig: web3.PublicKey;
  /** Parent storage account. */
  storageAccount: web3.PublicKey;
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

export const layout = borsh.struct([borsh.option(borsh.str(), "identifier")]);

/**
 * Context: This is user-facing. This is to be done whenever the user decides.
 * Function: This allows the user to change the amount of storage they have for this storage account.
 */
export function updateAccount2(
  args: UpdateAccount2Args,
  accounts: UpdateAccount2Accounts
) {
  const keys: Array<web3.AccountMeta> = [
    { pubkey: accounts.storageConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.storageAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([94, 86, 186, 115, 33, 187, 237, 8]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      identifier: args.identifier,
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
