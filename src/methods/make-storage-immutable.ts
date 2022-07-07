import * as anchor from "@project-serum/anchor";
import { getStakeAccount, findAssociatedTokenAddress } from "../utils/helpers";
import {
  emissions,
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
  tokenMint,
  uploader,
} from "../utils/common";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { ShadowDriveResponse } from "../types";
import fetch from "node-fetch";
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of a Storage Account
 * @param {string} version - ShadowDrive version (v1 or v2)
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */
export default async function makeStorageImmutable(
  key: anchor.web3.PublicKey,
  version: string
): Promise<ShadowDriveResponse> {
  let selectedAccount;
  try {
    switch (version.toLocaleLowerCase()) {
      case "v1":
        selectedAccount = await this.program.account.storageAccount.fetch(key);
        break;
      case "v2":
        selectedAccount = await this.program.account.storageAccountV2.fetch(
          key
        );
        break;
    }
    const ownerAta = await findAssociatedTokenAddress(
      selectedAccount.owner1,
      tokenMint
    );
    const emissionsAta = await findAssociatedTokenAddress(emissions, tokenMint);
    let stakeAccount = (await getStakeAccount(this.program, key))[0];
    let txn;
    switch (version.toLocaleLowerCase()) {
      case "v1":
        txn = await this.program.methods
          .makeAccountImmutable()
          .accounts({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            stakeAccount,
            emissionsWallet: emissionsAta,
            owner: selectedAccount.owner1,
            uploader: uploader,
            ownerAta,
            tokenMint: tokenMint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .transaction();
      case "v2":
        txn = await this.program.methods
          .makeAccountImmutable2()
          .accounts({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            owner: selectedAccount.owner1,
            ownerAta,
            stakeAccount,
            uploader: uploader,
            emissionsWallet: emissionsAta,
            tokenMint: tokenMint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .transaction();
        break;
    }
    txn.recentBlockhash = (
      await this.connection.getLatestBlockhash()
    ).blockhash;
    txn.feePayer = this.wallet.publicKey;
    if (!isBrowser) {
      await txn.partialSign(this.wallet.payer);
    } else {
      await this.wallet.signTransaction(txn);
    }
    const serializedTxn = txn.serialize({ requireAllSignatures: false });
    const makeImmutableResponse = await fetch(
      `${SHDW_DRIVE_ENDPOINT}/make-immutable`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction: Buffer.from(serializedTxn.toJSON().data).toString(
            "base64"
          ),
        }),
      }
    );
    if (!makeImmutableResponse.ok) {
      return Promise.reject(
        new Error(`Server response status code: ${
          makeImmutableResponse.status
        } \n 
			Server response status message: ${(await makeImmutableResponse.json()).error}`)
      );
    }
    const responseJson = await makeImmutableResponse.json();
    return Promise.resolve(responseJson);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
