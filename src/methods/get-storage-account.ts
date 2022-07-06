import { web3 } from "@project-serum/anchor";
import { StorageAccount } from "../types";

/**
 * Get one storage account for the current user
 * @param {PublicKey} key - Publickey of a Storage Account
 * @param {string} version - ShadowDrive version (v1 or v2)
 * @returns {StorageAccount} Storage Account
 *
 */
export default async function getStorageAcc(
  key: web3.PublicKey,
  version: string
): Promise<StorageAccount> {
  let storageAccount;
  try {
    switch (version.toLocaleLowerCase()) {
      case "v1":
        storageAccount = await this.program.account.storageAccountV2.fetch(key);
        break;
      case "v2":
        storageAccount = await this.program.account.storageAccountV2.fetch(key);
        break;
    }

    return Promise.resolve(storageAccount);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
