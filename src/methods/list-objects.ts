import * as anchor from "@project-serum/anchor";
import fetch from "cross-fetch";

import { ListObjectsResponse } from "../types";
import { SHDW_DRIVE_ENDPOINT } from "../utils/common";

/**
 *
 *  Method for retrieving v1 or v2 objects from ShadowDrive
 *
 * @param storageAccount {anchor.web3.PublicKey} - Public Key of the storage account to retrieve objects
 *
 * @returns {ListObjectsResponse}
 */

export default function listObjects(
  storageAccount: anchor.web3.PublicKey
): Promise<ListObjectsResponse> {
  return fetch(`${SHDW_DRIVE_ENDPOINT}/list-objects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ storageAccount: storageAccount.toBase58() }),
  }).then((res) => res.json());
}
