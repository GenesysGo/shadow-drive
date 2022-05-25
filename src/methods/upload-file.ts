import * as anchor from "@project-serum/anchor";
import { ShadowFile, ShadowUploadResponse } from "../types";
import uploadMultipleFiles from "./upload-multiple-files";
import { FileList } from "../utils/helpers";
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of Storage Account.
 * @param {File | ShadowFile} data - File or ShadowFile object, file extensions should be included in the name property of ShadowFiles.
 *
 * @returns {ShadowUploadResponse} - File location and transaction signature.
 */
export default async function uploadFile(
  key: anchor.web3.PublicKey,
  data: File | ShadowFile
): Promise<ShadowUploadResponse> {
  try {
    const fileList = data instanceof File ? FileList([data]) : [data];
    const [{ location: finalized_location, transaction_signature }] =
      await uploadMultipleFiles(key, fileList);
    return Promise.resolve({
      transaction_signature,
      finalized_location,
    });
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
