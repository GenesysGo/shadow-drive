import { StorageAccount } from "../types";

/**
 *
 * Get all storage accounts for the current user
 *
 * @returns {StorageAccount[]} - List of storage accounts
 *
 */
export default async function getStorageAccs(): Promise<StorageAccount[]> {
  try {
    const storageAccounts = await this.program.account.storageAccount.all([
      {
        memcmp: {
          bytes: this.wallet.publicKey,
          offset: 39,
        },
      },
    ]);
    return Promise.resolve(storageAccounts);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
