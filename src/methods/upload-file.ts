import { web3 } from "@coral-xyz/anchor";
import { isBrowser, SHDW_DRIVE_ENDPOINT } from "../utils/common";
import crypto from "crypto";
import fetch from "cross-fetch";
import { ShadowFile, ShadowUploadResponse } from "../types";
import NodeFormData from "form-data";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import nacl from "tweetnacl";
/**
 *
 * @param {web3.PublicKey} key - Publickey of Storage Account.
 * @param {File | ShadowFile} data - File or ShadowFile object, file extensions should be included in the name property of ShadowFiles.
 * @param {Boolean} overwrite - If true, overwrites if existing. Default is false.
 * @returns {ShadowUploadResponse} File location and transaction signature.
 */
export default async function uploadFile(
  key: web3.PublicKey,
  data: File | ShadowFile,
  overwrite: Boolean = false
): Promise<ShadowUploadResponse> {
  let fileErrors = [];
  let fileBuffer: Buffer;
  let form;
  let file;

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
      file: data.name,
      erorr: "Exceeds the 1GB limit.",
    });
  }
  /**
   *
   * Users must remember to include the file extension when uploading from Node.
   *
   */
  //   if (!isBrowser && data.name.lastIndexOf(".") == -1) {
  //     fileErrors.push({
  //       file: data.name,
  //       error: "File extension must be included.",
  //     });
  //   }
  if (fileErrors.length) {
    return Promise.reject(fileErrors);
  }
  if (!this.userInfo) {
    return Promise.reject(
      "You have not created a storage account on Shadow Drive yet. Please see the 'create-storage-account' command to get started."
    );
  }
  const fileHashSum = crypto.createHash("sha256");
  const fileNameHashSum = crypto.createHash("sha256");
  fileHashSum.update(
    Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer)
  );
  fileNameHashSum.update(data.name);

  const fileNameHash = fileNameHashSum.digest("hex");
  try {
    const msg = new TextEncoder().encode(
      `Shadow Drive Signed Message:\nStorage Account: ${key}\nUpload files with hash: ${fileNameHash}`
    );
    let msgSig: Uint8Array;
    if (!this.wallet.signMessage) {
      msgSig = nacl.sign.detached(msg, this.wallet.payer.secretKey);
    } else {
      msgSig = await this.wallet.signMessage(msg);
    }
    const encodedMsg = bs58.encode(msgSig);
    form.append("fileNames", data.name);
    form.append("message", encodedMsg);
    form.append("storage_account", key.toString());
    form.append("signer", this.wallet.publicKey.toString());
    if(overwrite) {
      form.append("overwrite", "true");
    }
  } catch (e) {
    return Promise.reject(new Error(e.message));
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7200000);
    const uploadResponse = await fetch(`${SHDW_DRIVE_ENDPOINT}/upload`, {
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
    const responseJson = await uploadResponse.json();
    return Promise.resolve(responseJson);
  } catch (e) {
    return Promise.reject(new Error(e.message));
  }
}
