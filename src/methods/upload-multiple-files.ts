import * as anchor from "@project-serum/anchor";
import {
  humanSizeToBytes,
  bytesToHuman,
  getStorageAccount,
  getStakeAccount,
  findAssociatedTokenAddress,
} from "../utils/helpers";
import {
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
  tokenMint,
  uploader,
} from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import FormData from "form-data";
/**
 *
 * @param key - Storage account PublicKey to upload the files to.
 * @param file - File path.
 * @param data[] - Array of FormData objects to be uploaded
 *
 * @returns
 */

export default async function uploadMultipleFiles(
  key: PublicKey,
  file: string,
  data: FormData[]
): Promise<Error | Object> {
  return;
}
