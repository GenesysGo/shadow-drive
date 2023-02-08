import * as anchor from "@project-serum/anchor";
import {
  humanSizeToBytes,
  getStakeAccount,
  findAssociatedTokenAddress,
} from "../utils/helpers";
import {
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
  tokenMint,
  uploader,
  emissions,
} from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ShadowDriveVersion, ShadowDriveResponse } from "../types";
import fetch from "node-fetch";
/**
 *
 * @param {anchor.web3.PublicKey} key - Public Key of the existing storage to increase size on
 * @param {string} size - Amount of storage you are requesting to add to your storage account. Should be in a string like '1KB', '1MB', '1GB'. Only KB, MB, and GB storage delineations are supported currently.
 * @param {ShadowDriveVersion} version - ShadowDrive version (v1 or v2)
 * @returns {ShadowMessageResponse} Confirmed transaction ID
 */
export default async function addStorage(
  key: anchor.web3.PublicKey,
  size: string,
  version: ShadowDriveVersion
): Promise<ShadowDriveResponse> {
  let storageInputAsBytes = humanSizeToBytes(size);
  let selectedAccount;
  switch (version.toLocaleLowerCase()) {
    case "v1":
      selectedAccount = await this.program.account.storageAccount.fetch(key);
      break;
    case "v2":
      selectedAccount = await this.program.account.storageAccountV2.fetch(key);
      break;
  }
  if (storageInputAsBytes === false) {
    return Promise.reject(
      new Error(
        `${size} is not a valid input for size. Please use a string like '1KB', '1MB', '1GB'.`
      )
    );
  }
  let userInfoAccount = await this.connection.getAccountInfo(this.userInfo);
  let userInfoData;
  let accountSeed;
  if (userInfoAccount !== null) {
    userInfoData = await this.program.account.userInfo.fetch(this.userInfo);
    accountSeed = new anchor.BN(userInfoData.accountCounter);
  } else {
    return Promise.reject(
      new Error(
        "You have not created a storage account on Shadow Drive yet. Please see the 'create-storage-account' command to get started."
      )
    );
  }
  const ownerAta = await findAssociatedTokenAddress(
    selectedAccount.owner1,
    tokenMint
  );
  let stakeAccount = (await getStakeAccount(this.program, key))[0];

  try {
    const emissionsAta = await findAssociatedTokenAddress(emissions, tokenMint);
    let txn;
    switch (version.toLocaleLowerCase()) {
      case "v1":
        switch (selectedAccount.immutable) {
          case true:
            txn = await this.program.methods
              .increaseImmutableStorage(new anchor.BN(storageInputAsBytes))
              .accounts({
                storageConfig: this.storageConfigPDA,
                storageAccount: key,
                owner: selectedAccount.owner1,
                ownerAta,
                uploader: uploader,
                emissionsWallet: emissionsAta,
                tokenMint: tokenMint,
                systemProgram: anchor.web3.SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
              })
              .transaction();
            break;
          case false:
            txn = await this.program.methods
              .increaseStorage(new anchor.BN(storageInputAsBytes))
              .accounts({
                storageConfig: this.storageConfigPDA,
                storageAccount: key,
                owner: selectedAccount.owner1,
                ownerAta,
                stakeAccount,
                uploader: uploader,
                tokenMint: tokenMint,
                systemProgram: anchor.web3.SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
              })
              .transaction();
            break;
        }
        break;
      case "v2":
        switch (selectedAccount.immutable) {
          case true:
            txn = await this.program.methods
              .increaseImmutableStorage2(new anchor.BN(storageInputAsBytes))
              .accounts({
                storageConfig: this.storageConfigPDA,
                storageAccount: key,
                owner: selectedAccount.owner1,
                ownerAta,
                uploader: uploader,
                emissionsWallet: emissionsAta,
                tokenMint: tokenMint,
                systemProgram: anchor.web3.SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
              })
              .transaction();
            break;
          case false:
            txn = await this.program.methods
              .increaseStorage2(new anchor.BN(storageInputAsBytes))
              .accounts({
                storageConfig: this.storageConfigPDA,
                storageAccount: key,
                owner: selectedAccount.owner1,
                ownerAta,
                stakeAccount,
                uploader: uploader,
                tokenMint: tokenMint,
                systemProgram: anchor.web3.SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
              })
              .transaction();
            break;
        }
        break;
    }
    txn.recentBlockhash = (
      await this.connection.getLatestBlockhash()
    ).blockhash;
    txn.feePayer = this.wallet.publicKey;
    let signedTx;
    if (!isBrowser) {
      signedTx = await txn.partialSign(this.wallet.payer);
    } else {
      signedTx = await this.wallet.signTransaction(txn);
    }
    const serializedTxn = signedTx.serialize({ requireAllSignatures: false });

    const addStorageResponse = await fetch(
      `${SHDW_DRIVE_ENDPOINT}/add-storage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction: Buffer.from(serializedTxn.toJSON().data).toString(
            "base64"
          ),
          storage_account: key,
          amount_to_add: storageInputAsBytes,
        }),
      }
    );
    if (!addStorageResponse.ok) {
      return Promise.reject(
        new Error(`Server response status code: ${addStorageResponse.status} \n
		  Server response status message: ${(await addStorageResponse.json()).error}`)
      );
    }
    const responseJson = await addStorageResponse.json();
    return Promise.resolve(responseJson);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
