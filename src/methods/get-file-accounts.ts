import * as anchor from "@project-serum/anchor";
import { FileAccount } from "../types";
/**
 *
 * Method for retrieving v1 File Accounts
 *
 * @param {anchor.web3.PublicKey} key - Public Key of the existing storage to increase size on
 * @param {string} version - ShadowDrive version (v1 or v2)
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */
export default async function getFileAccounts(
  key: anchor.web3.PublicKey,
  version: string
): Promise<FileAccount[]> {
  let selectedAccount;
  switch (version.toLocaleLowerCase()) {
    case "v1":
      selectedAccount = await this.program.account.storageAccount.fetch(key);
      break;
    case "v2":
      selectedAccount = await this.program.account.storageAccountV2.fetch(key);
      break;
  }
  const fileKeys: anchor.web3.PublicKey[] = [];
  const fileAccounts: FileAccount[] = [];
  for (let i = 0; i < selectedAccount.initCounter; i++) {
    let [file, fileBump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        key.toBytes(),
        ,
        new anchor.BN(i).toTwos(64).toArrayLike(Buffer, "le", 4),
      ],
      this.program.programId
    );
    fileKeys.push(file);
  }
  console.log(fileKeys);
  for (const fileKey of fileKeys) {
    fileAccounts.push(await this.program.account.file.fetch(fileKey));
  }
  return Promise.resolve(fileAccounts);
}
