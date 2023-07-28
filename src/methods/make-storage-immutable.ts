import * as anchor from "@coral-xyz/anchor";
import {
  getStakeAccount,
  findAssociatedTokenAddress,
  getStorageAccountSize,
} from "../utils/helpers";
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
import { ShadowDriveVersion, ShadowDriveResponse } from "../types";
import fetch from "node-fetch";
import { StorageAccount, StorageAccountV2 } from "accounts";
import { makeAccountImmutable, makeAccountImmutable2 } from "instructions";
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of a Storage Account
 * @param {ShadowDriveVersion} version - ShadowDrive version (v1 or v2)
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */
export default async function makeStorageImmutable(
  key: anchor.web3.PublicKey,
  version: ShadowDriveVersion
): Promise<ShadowDriveResponse> {
  let selectedAccount;
  try {
    switch (version.toLocaleLowerCase()) {
      case "v1":
        selectedAccount = await StorageAccount.fetch(this.connection, key);
        break;
      case "v2":
        selectedAccount = await StorageAccountV2.fetch(this.connection, key);
        break;
    }
    const ownerAta = await findAssociatedTokenAddress(
      selectedAccount.owner1,
      tokenMint
    );
    const storageUsed = await getStorageAccountSize(key.toString());
    const emissionsAta = await findAssociatedTokenAddress(emissions, tokenMint);
    let stakeAccount = (await getStakeAccount(this.program, key))[0];
    let txn = new anchor.web3.Transaction();
    switch (version.toLocaleLowerCase()) {
      case "v1":
        const makeImmutableIx = makeAccountImmutable(
          { storageUsed: new anchor.BN(storageUsed) },
          {
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
          }
        );
        txn.add(makeImmutableIx);
      case "v2":
        const makeImmutableIx2 = makeAccountImmutable2(
          { storageUsed: new anchor.BN(storageUsed) },
          {
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
          }
        );
        txn.add(makeImmutableIx2);
        break;
    }
    txn.recentBlockhash = (
      await this.connection.getLatestBlockhash()
    ).blockhash;
    txn.feePayer = this.wallet.publicKey;
    let signedTx;
    let serializedTxn;
    if (!isBrowser) {
      await txn.partialSign(this.wallet.payer);
      serializedTxn = txn.serialize({ requireAllSignatures: false });
    } else {
      signedTx = await this.wallet.signTransaction(txn);
      serializedTxn = signedTx.serialize({ requireAllSignatures: false });
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7200000);
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
          storageUsed: storageUsed,
        }),
        signal: controller.signal,
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
