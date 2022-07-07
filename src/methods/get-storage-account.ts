import { web3 } from "@project-serum/anchor";
import { SHDW_DRIVE_ENDPOINT } from "../utils/common";
import { StorageAccountInfo } from "../types";
import fetch from "node-fetch";
/**
 * Get storage account details
 * @param {PublicKey} key - Publickey of a Storage Account
 * @returns {StorageAccountInfo} Storage Account
 *
 */
export default async function getStorageAcc(
  key: web3.PublicKey
): Promise<StorageAccountInfo> {
  try {
    const storageInfoResponse = await fetch(
      `${SHDW_DRIVE_ENDPOINT}/storage-account-info`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storage_account: key,
        }),
      }
    );
    if (!storageInfoResponse.ok) {
      return Promise.reject(
        new Error(
          `Server response status code: ${
            storageInfoResponse.status
          } \n Server response status message: ${
            (await storageInfoResponse.json()).error
          }`
        )
      );
    }
    return Promise.resolve(await storageInfoResponse.json());
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
