import { PublicKey } from "@solana/web3.js";
import fetch from "cross-fetch";
import { SHDW_DRIVE_ENDPOINT } from "../utils/common";

export default function listObjects(
  storageAccount: PublicKey
): Promise<string[]> {
  return fetch(`${SHDW_DRIVE_ENDPOINT}/list-objects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ storageAccount: storageAccount.toBase58() }),
  }).then((res) => res.json());
}
