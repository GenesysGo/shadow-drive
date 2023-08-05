import { web3, BN } from "@coral-xyz/anchor";
import {
  humanSizeToBytes,
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
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ShadowDriveResponse } from "../types";
import fetch from "node-fetch";
import { decreaseStorage2 } from "../types/instructions";
import { StorageAccountV2 } from "../types/accounts";
import { PROGRAM_ID } from "../types/programId";
/**
 *
 * @param {web3.PublicKey} key - Publickey of a Storage Account
 * @param {string} size - Amount of storage you are requesting to reduce from your storage account. Should be in a string like '1KB', '1MB', '1GB'. Only KB, MB, and GB storage delineations are supported currently.
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */
export default async function reduceStorage(
  key: web3.PublicKey,
  size: string
): Promise<ShadowDriveResponse> {
  let storageInputAsBytes = humanSizeToBytes(size);
  let selectedAccount = await StorageAccountV2.fetch(this.connection, key);
  const [unstakeAccount] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("unstake-account"), key.toBytes()],
    PROGRAM_ID
  );
  const [unstakeInfo] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("unstake-info"), key.toBytes()],
    PROGRAM_ID
  );
  const ownerAta = await findAssociatedTokenAddress(
    selectedAccount.owner1,
    tokenMint
  );
  let stakeAccount = (await getStakeAccount(this.program, key))[0];
  const emissionsAta = await findAssociatedTokenAddress(emissions, tokenMint);
  try {
    const storageUsed = await getStorageAccountSize(key.toString());
    let txn = new web3.Transaction();
    const decreaseStorageIx2 = decreaseStorage2(
      {
        storageUsed: new BN(storageUsed),
        removeStorage: new BN(storageInputAsBytes.toString()),
      },
      {
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
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY,
      }
    );
    txn.add(decreaseStorageIx2);

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
          storageUsed: storageUsed,
        }),
        signal: controller.signal,
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
    return Promise.reject(new Error(e.message));
  }
}
