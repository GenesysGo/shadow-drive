import { web3 } from "@coral-xyz/anchor";
import { StorageAccountV2, UserInfo } from "../types/accounts";
/**
 *
 * Get all storage accounts for the current user
 * @returns {StorageAccountResponse[]} - List of storage accounts
 *
 */
export default async function getStorageAccs(): Promise<
  Array<{
    publicKey: web3.PublicKey;
    account: StorageAccountV2;
  }>
> {
  let storageAccounts;
  let userInfoAccount = await UserInfo.fetch(this.connection, this.userInfo);
  if (userInfoAccount === null) {
    return Promise.reject(
      new Error(
        "You have not created a storage account on Shadow Drive yet. Please see the 'create-storage-account' command to get started."
      )
    );
  }
  try {
    const walletPubKey =
      this.wallet.publicKey?.toBase58() ?? this.wallet.publicKey;

    storageAccounts = await this.program.account.storageAccountV2.all([
      {
        memcmp: {
          bytes: walletPubKey,
          offset: 22,
        },
      },
    ]);

    return Promise.resolve(storageAccounts);
  } catch (e) {
    return Promise.reject(new Error(e.message));
  }
}
