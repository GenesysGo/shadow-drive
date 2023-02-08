import * as anchor from "@project-serum/anchor";
import {
  humanSizeToBytes,
  getStakeAccount,
  findAssociatedTokenAddress,
} from "../utils/helpers";
import {
  emissions,
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
  tokenMint,
  uploader,
} from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ShadowDriveVersion, ShadowDriveResponse } from "../types";
import fetch from "node-fetch";
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of a Storage Account
 * @param {string} size - Amount of storage you are requesting to reduce from your storage account. Should be in a string like '1KB', '1MB', '1GB'. Only KB, MB, and GB storage delineations are supported currently.
 * @param {ShadowDriveVersion} version - ShadowDrive version (v1 or v2)
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */
export default async function reduceStorage(
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
  const [unstakeAccount] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("unstake-account"), key.toBytes()],
    this.program.programId
  );
  const [unstakeInfo] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("unstake-info"), key.toBytes()],
    this.program.programId
  );
  const ownerAta = await findAssociatedTokenAddress(
    selectedAccount.owner1,
    tokenMint
  );
  let stakeAccount = (await getStakeAccount(this.program, key))[0];
  const emissionsAta = await findAssociatedTokenAddress(emissions, tokenMint);
  try {
    let txn;
    switch (version.toLocaleLowerCase()) {
      case "v1":
        txn = await this.program.methods
          .decreaseStorage(new anchor.BN(storageInputAsBytes.toString()))
          .accounts({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            unstakeInfo,
            unstakeAccount,
            owner: selectedAccount.owner1,
            ownerAta,
            uploader: uploader,
            stakeAccount,
            emissionsWallet: emissionsAta,
            tokenMint: tokenMint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .transaction();
        break;
      case "v2":
        txn = await this.program.methods
          .decreaseStorage2(new anchor.BN(storageInputAsBytes.toString()))
          .accounts({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            unstakeInfo,
            unstakeAccount,
            owner: selectedAccount.owner1,
            ownerAta,
            uploader: uploader,
            stakeAccount,
            emissionsWallet: emissionsAta,
            tokenMint: tokenMint,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          })
          .transaction();
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
    const serializedTxn = txn.serialize({ requireAllSignatures: false });
    const reduceStorageResponse = await fetch(
      `${SHDW_DRIVE_ENDPOINT}/reduce-storage`,
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
          amount_to_reduce: storageInputAsBytes,
        }),
      }
    );
    const res = await reduceStorageResponse.json();
    if (!reduceStorageResponse.ok) {
      return Promise.reject(
        new Error(`Server response status code: ${reduceStorageResponse.status} \n
			Server response status message: ${res.error}`)
      );
    }
    const responseJson = res;
    return Promise.resolve(responseJson);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
