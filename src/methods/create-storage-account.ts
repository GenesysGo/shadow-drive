import * as anchor from "@project-serum/anchor";
import {
  humanSizeToBytes,
  getStorageAccount,
  getStakeAccount,
  findAssociatedTokenAddress,
} from "../utils/helpers";
import {
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
  tokenMint,
  uploader,
} from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import fetch from "cross-fetch";
import { ShadowDriveVersion, CreateStorageResponse } from "../types";
/**
 *
 * @param {string} name - What you want your storage account to be named. (Does not have to be unique)
 * @param {string} size - Amount of storage you are requesting to create. Should be in a string like '1KB', '1MB', '1GB'. Only KB, MB, and GB storage delineations are supported currently.
 * @param {ShadowDriveVersion} version - ShadowDrive version(v1 or v2)
 * @param {anchor.web3.PublicKey} owner2 - Optional secondary owner for the storage account.
 * @returns {CreateStorageResponse} Created bucket and transaction signature
 */
export default async function createStorageAccount(
  name: string,
  size: string,
  version: ShadowDriveVersion,
  owner2?: anchor.web3.PublicKey
): Promise<CreateStorageResponse> {
  let storageInputAsBytes = humanSizeToBytes(size);
  if (storageInputAsBytes === false) {
    return Promise.reject(
      new Error(
        `${size} is not a valid input for size. Please use a string like '1KB', '1MB', '1GB'.`
      )
    );
  }
  let [userInfo, userInfoBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("user-info"), this.wallet.publicKey.toBytes()],
    this.program.programId
  );
  // If userInfo hasn't been initialized, default to 0 for account seed
  let userInfoAccount = await this.connection.getAccountInfo(this.userInfo);
  let accountSeed = new anchor.BN(0);
  if (userInfoAccount !== null) {
    let userInfoData = await this.program.account.userInfo.fetch(this.userInfo);
    accountSeed = new anchor.BN(userInfoData.accountCounter);
  } else {
    this.userInfo = userInfo;
  }

  let storageRequested = new anchor.BN(storageInputAsBytes.toString()); // 2^30 B <==> 1GB

  // Retreive storageAccount
  let storageAccount = (
    await getStorageAccount(this.program, this.wallet.publicKey, accountSeed)
  )[0];
  // Retrieve stakeAccount
  let stakeAccount = (await getStakeAccount(this.program, storageAccount))[0];

  let ownerAta = await findAssociatedTokenAddress(
    this.wallet.publicKey,
    tokenMint
  );
  let txn;
  switch (version.toLocaleLowerCase()) {
    case "v1":
      txn = await this.program.methods
        .initializeAccount(name, storageRequested, owner2 ? owner2 : null)
        .accounts({
          storageConfig: this.storageConfigPDA,
          userInfo: this.userInfo,
          storageAccount,
          stakeAccount,
          tokenMint,
          owner1: this.wallet.publicKey,
          uploader: uploader,
          owner1TokenAccount: ownerAta,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .transaction();
      break;
    case "v2":
      txn = await this.program.methods
        .initializeAccount2(name, storageRequested)
        .accounts({
          storageConfig: this.storageConfigPDA,
          userInfo: this.userInfo,
          storageAccount,
          stakeAccount,
          tokenMint,
          owner1: this.wallet.publicKey,
          uploader: uploader,
          owner1TokenAccount: ownerAta,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .transaction();
      break;
  }
  try {
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
    const createStorageResponse = await fetch(
      `${SHDW_DRIVE_ENDPOINT}/storage-account`,
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
    if (!createStorageResponse.ok) {
      return Promise.reject(
        new Error(`Server response status code: ${
          createStorageResponse.status
        } \n
		Server response status message: ${(await createStorageResponse.json()).error}`)
      );
    }
    const responseJson =
      (await createStorageResponse.json()) as CreateStorageResponse;
    return Promise.resolve(responseJson);
  } catch (e) {
    console.log(`Error from fileserver ${e}`);
    return Promise.reject(new Error(e));
  }
}
