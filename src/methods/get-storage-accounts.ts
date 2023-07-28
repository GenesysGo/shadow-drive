import { web3 } from "@coral-xyz/anchor";
import { StorageAccount, StorageAccountV2 } from "accounts";
/**
 *
 * Get all storage accounts for the current user
 * @returns {StorageAccountResponse[]} - List of storage accounts
 *
 */
export default async function getStorageAccs(): Promise<
  Array<{
    publicKey: web3.PublicKey;
    account: StorageAccount | StorageAccountV2;
  }>
> {
  let storageAccounts;
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
    return Promise.reject(new Error(e));
  }
}
