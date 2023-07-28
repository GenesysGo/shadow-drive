import { ShadowDriveVersion, StorageAccountResponse } from "../types";
import { web3 } from "@coral-xyz/anchor";
import { StorageAccount, StorageAccountV2 } from "accounts";
/**
 *
 * Get all storage accounts for the current user
 * @param {ShadowDriveVersion} version - ShadowDrive version (v1 or v2)
 * @returns {StorageAccountResponse[]} - List of storage accounts
 *
 */
export default async function getStorageAccs(
  version: ShadowDriveVersion
): Promise<
  Array<{
    publicKey: web3.PublicKey;
    account: StorageAccount | StorageAccountV2;
  }>
> {
  let storageAccounts;
  try {
    const walletPubKey =
      this.wallet.publicKey?.toBase58() ?? this.wallet.publicKey;

    switch (version.toLocaleLowerCase()) {
      case "v1":
        storageAccounts = await this.program.account.storageAccount.all([
          {
            memcmp: {
              bytes: walletPubKey,
              offset: 39,
            },
          },
        ]);
        break;
      case "v2":
        storageAccounts = await this.program.account.storageAccountV2.all([
          {
            memcmp: {
              bytes: walletPubKey,
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
