import { web3 } from "@coral-xyz/anchor";
import { StorageAccountV2, UserInfo } from "../types/accounts";
/**
 *
 * Get a single storage account for the current user
 * @param {PublicKey} key - Publickey of a Storage Account
 * @returns {StorageAccountResponse} - Requested Storage Account
 *
 */
export default async function getStorageAcc(key: web3.PublicKey): Promise<{
  publicKey: web3.PublicKey;
  account: StorageAccountV2;
}> {
  let storageAccount;
  let userInfoAccount = await UserInfo.fetch(this.connection, this.userInfo);
  if (userInfoAccount === null) {
    return Promise.reject(
      new Error(
        "You have not created a storage account on Shadow Drive yet. Please see the 'create-storage-account' command to get started."
      )
    );
  }
  try {
    storageAccount = await this.program.account.storageAccountV2.fetch(key);

    return Promise.resolve(storageAccount);
  } catch (e) {
    return Promise.reject(new Error(e.message));
  }
}
