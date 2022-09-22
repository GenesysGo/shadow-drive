import * as anchor from "@project-serum/anchor";
import { isBrowser, SHDW_DRIVE_ENDPOINT } from "../utils/common";
import crypto from "crypto";
import {
  ShadowBatchUploadResponse,
  ShadowFile,
  ListObjectsResponse,
} from "../types";
import NodeFormData from "form-data";
import { getChunkLength } from "../utils/helpers";
import fetch from "cross-fetch";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import nacl from "tweetnacl";
import { from, map, mergeMap, toArray } from "rxjs";
import { PathLike } from "fs";
import { rejects } from "assert";

interface FileData {
  name: string;
  buffer: Buffer;
  file: Buffer | File;
  form?: any;
  size: anchor.BN;
  url: string;
}

// TODO update return type here
export default async function uploadMultipartFile(
  key: anchor.web3.PublicKey,
  fileLocation: PathLike,
  callback?: Function
): Promise<void> {
  // TODO add browser support for file chunking
  if (isBrowser) {
    return Promise.reject("Currently not compatible with browsers yet.");
  }
  // console.log("aye should be doing things");
  // Initiate the multipart upload first
  // Once multipart upload is initiated, then can move on to reading file in chunks and uploading
  // Once chunked file is uploaded in parts, complete the multipart
  // If there's an error, abort the multipart upload and let the user know of the error
}
