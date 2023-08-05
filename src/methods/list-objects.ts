import { web3 } from "@coral-xyz/anchor";
import fetch from "cross-fetch";

import { ListObjectsResponse } from "../types";
import { SHDW_DRIVE_ENDPOINT } from "../utils/common";

export default function listObjects(
  storageAccount: web3.PublicKey
): Promise<ListObjectsResponse> {
  return fetch(`${SHDW_DRIVE_ENDPOINT}/list-objects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ storageAccount: storageAccount.toBase58() }),
  }).then((res) => res.json());
}
