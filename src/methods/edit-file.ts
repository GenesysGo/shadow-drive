import * as anchor from "@coral-xyz/anchor";
import { isBrowser, SHDW_DRIVE_ENDPOINT } from "../utils/common";
import crypto from "crypto";
import { ShadowDriveVersion, ShadowFile, ShadowEditResponse } from "../types";
import fetch from "cross-fetch";
import NodeFormData from "form-data";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import nacl from "tweetnacl";
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of Storage Account
 * @param {string} url - URL of existing file
 * @param {File | ShadowFile} data - File or ShadowFile object, file extensions should be included in the name property of ShadowFiles.
 * @param {ShadowDriveVersion} version - ShadowDrive version (v1 or v2)
 * @returns {ShadowEditResponse} - File location
 */

export default async function editFile(
  key: anchor.web3.PublicKey,
  url: string,
  data: File | ShadowFile,
  version: ShadowDriveVersion
): Promise<ShadowEditResponse> {
  let fileErrors = [];
  let fileBuffer: Buffer | ArrayBuffer;
  let form;
  let file;
  let selectedAccount;
  switch (version.toLocaleLowerCase()) {
    case "v1":
      selectedAccount = await this.program.account.storageAccount.fetch(key);
      break;
    case "v2":
      selectedAccount = await this.program.account.storageAccountV2.fetch(key);
      break;
  }
  if (!isBrowser) {
    data = data as ShadowFile;
    form = new NodeFormData();
    file = data.file;
    form.append("file", file, data.name);
    fileBuffer = file;
  } else {
    file = data as File;
    form = new FormData();
    form.append("file", file, file.name);
    fileBuffer = Buffer.from(new Uint8Array(await file.arrayBuffer()));
  }

  if (fileBuffer.byteLength > 1_073_741_824 * 1) {
    fileErrors.push({
      file: file,
      erorr: "Exceeds the 1GB limit.",
    });
  }
  if (fileErrors.length) {
    return Promise.reject(fileErrors);
  }
  const userInfoAccount = await this.connection.getAccountInfo(this.userInfo);
  if (userInfoAccount === null) {
    return Promise.reject(
      new Error(
        "You have not created a storage account on Shadow Drive yet. Please see the 'create-storage-account' command to get started."
      )
    );
  }
  const existingFileData = await fetch(
    `${SHDW_DRIVE_ENDPOINT}/get-object-data`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: url,
      }),
    }
  );
  const fileDataResponse = await existingFileData.json();
  const fileOwnerOnChain = new anchor.web3.PublicKey(
    fileDataResponse.file_data["owner-account-pubkey"]
  );
  if (!fileOwnerOnChain.equals(this.wallet.publicKey)) {
    return Promise.reject(new Error("Permission denied: Not file owner"));
  }
  const storageAccount = new anchor.web3.PublicKey(
    fileDataResponse.file_data["storage-account-pubkey"]
  );
  const hashSum = crypto.createHash("sha256");
  hashSum.update(
    Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer)
  );
  const sha256Hash = hashSum.digest("hex");
  let size = new anchor.BN(fileBuffer.byteLength);

  try {
    const msg = Buffer.from(
      `Shadow Drive Signed Message:\n StorageAccount: ${key}\nFile to edit: ${data.name}\nNew file hash: ${sha256Hash}`
    );
    let msgSig;
    if (!this.wallet.signMessage) {
      msgSig = nacl.sign.detached(msg, this.wallet.payer.secretKey);
    } else {
      msgSig = await this.wallet.signMessage(msg);
    }
    const encodedMsg = bs58.encode(msgSig);
    form.append("message", encodedMsg);
    form.append("signer", this.wallet.publicKey.toString());
    form.append("storage_account", key.toString());
    form.append("url", url);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7200000);
    const uploadResponse = await fetch(`${SHDW_DRIVE_ENDPOINT}/edit`, {
      method: "POST",
      //@ts-ignore
      body: form,
      signal: controller.signal,
    });
    if (!uploadResponse.ok) {
      return Promise.reject(
        new Error(`Server response status code: ${uploadResponse.status} \n
				  Server response status message: ${(await uploadResponse.json()).error}`)
      );
    }
    const responseJson: ShadowEditResponse = await uploadResponse.json();
    return Promise.resolve(responseJson);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
