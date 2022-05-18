import { web3 } from "@project-serum/anchor";
import { StorageAccount } from "../types";

/**
 * Get one storage account for the current user
 * @param {PublicKey} key - Publickey of a Storage Account
 *
 * @returns {StorageAccount} Storage Account
 *
 */
export default async function getStorageAcc(
  key: web3.PublicKey
): Promise<StorageAccount> {
  try {
    const storageAccount = await this.program.account.storageAccount.fetch(key);
    return Promise.resolve(storageAccount);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
