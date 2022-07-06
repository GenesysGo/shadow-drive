import * as anchor from "@project-serum/anchor";
import {
  humanSizeToBytes,
  getStakeAccount,
  findAssociatedTokenAddress,
  sendAndConfirm,
} from "../utils/helpers";
import {
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
  tokenMint,
  uploader,
} from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ShadowDriveResponse } from "../types";
/**
 *
 * @param {anchor.web3.PublicKey} key - Public Key of the existing storage to increase size on
 * @param {string} version - ShadowDrive version (V1 or V2)
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */
export default async function getFiles(
  key: anchor.web3.PublicKey,
  version: string
): Promise<ShadowDriveResponse> {
  let selectedAccount;
  switch (version) {
    case "v1":
      selectedAccount = await this.program.account.storageAccountV1.fetch(key);
      break;
    case "v2":
      selectedAccount = await this.program.account.storageAccountV2.fetch(key);
      break;
  }
  const fileKeys = [];
  if (version == "v1") {
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
  } else {
    //Do somethin to retrieve v2 files
  }
  return;
}
