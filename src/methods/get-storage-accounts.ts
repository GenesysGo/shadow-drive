import { StorageAccountResponse } from "../types";

/**
 *
 * Get all storage accounts for the current user
 *
 * @returns {StorageAccountResponse[]} - List of storage accounts
 *
 */
export default async function getStorageAccs(): Promise<
  StorageAccountResponse[]
> {
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
