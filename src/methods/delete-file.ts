import { web3 } from "@coral-xyz/anchor";
import { SHDW_DRIVE_ENDPOINT } from "../utils/common";
import { ShadowDriveResponse } from "../types";
import fetch from "cross-fetch";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import nacl from "tweetnacl";
/**
 *
 * @param {web3.PublicKey} key - Publickey of Storage Account
 * @param {string} url - Shadow Drive URL of the file you are requesting to delete.
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */

export default async function deleteFile(
  key: web3.PublicKey,
  url: string
): Promise<ShadowDriveResponse> {
  let fileData, fileDataResponse;
  try {
    fileData = await fetch(`${SHDW_DRIVE_ENDPOINT}/get-object-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: decodeURI(url),
      }),
    });
    fileDataResponse = await fileData.json();
  } catch (e: any) {
    return Promise.reject(new Error(`${e.message}`));
  }
  const fileOwnerOnChain = new web3.PublicKey(
    fileDataResponse.file_data["owner-account-pubkey"]
  );
  if (!fileOwnerOnChain.equals(this.wallet.publicKey)) {
    return Promise.reject(new Error("Permission denied: Not file owner"));
  }
  try {
    let deleteFileResponse;
    const msg = Buffer.from(
      `Shadow Drive Signed Message:\nStorageAccount: ${key}\nFile to delete: ${url}`
    );
    let msgSig: Uint8Array;
    if (!this.wallet.signMessage) {
      msgSig = nacl.sign.detached(msg, this.wallet.payer.secretKey);
    } else {
      msgSig = await this.wallet.signMessage(msg);
    }
    const encodedMsg = bs58.encode(msgSig);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7200000);
    deleteFileResponse = await fetch(`${SHDW_DRIVE_ENDPOINT}/delete-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signer: this.wallet.publicKey,
        message: encodedMsg,
        location: url,
      }),
      signal: controller.signal,
    });
    if (!deleteFileResponse.ok) {
      return Promise.reject(
        new Error(`Server response status code: ${deleteFileResponse.status} \n
					  Server response status message: ${(await deleteFileResponse.json()).error}`)
      );
    }
    const responseJson = await deleteFileResponse.json();
    return Promise.resolve(responseJson);
  } catch (e: any) {
    return Promise.reject(new Error(`${e.message}`));
  }
}
