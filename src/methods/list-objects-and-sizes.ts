import { PublicKey } from "@solana/web3.js";
import fetch from "cross-fetch";

import { ListObjectsAndSizesResponse } from "../types";
import { SHDW_DRIVE_ENDPOINT } from "../utils/common";

export default function listObjectsAndSizes(
  storageAccount: PublicKey
): Promise<ListObjectsAndSizesResponse> {
  return fetch(`${SHDW_DRIVE_ENDPOINT}/list-objects-and-sizes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ storageAccount: storageAccount.toBase58() }),
  }).then((res) => res.json());
}
