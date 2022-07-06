import { StorageAccountResponse } from "../types";

/**
 *
 * Get all storage accounts for the current user
 * @param {string} version - ShadowDrive version (V1 or V2)
 * @returns {StorageAccountResponse[]} - List of storage accounts
 *
 */
export default async function getStorageAccs(
  version: string
): Promise<StorageAccountResponse[]> {
  let storageAccounts;
  try {
    switch (version) {
      case "v1":
        storageAccounts = await this.program.account.storageAccountV1.all([
          {
            memcmp: {
              bytes: this.wallet.publicKey,
              offset: 39,
            },
          },
        ]);
        break;
      case "v2":
        storageAccounts = await this.program.account.storageAccountV2.all([
          {
            memcmp: {
              bytes: this.wallet.publicKey,
              offset: 22,
            },
          },
        ]);
        break;
    }

    return Promise.resolve(storageAccounts);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
