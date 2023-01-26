import * as anchor from "@project-serum/anchor";
import {
  FILE_CHUNK_SIZE,
  isBrowser,
  SHDW_DRIVE_ENDPOINT,
} from "../utils/common";
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
import fs, { PathLike } from "fs";
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
/**
 *
 * @param {anchor.web3.PublicKey} key - Publickey of Storage Account.
 @param {PathLike} fileLocation - path of the file
 @param {Function} callback - callback function after file uploads successfully
 */
export default async function uploadMultipartFile(
  key: anchor.web3.PublicKey,
  // data: File | ShadowFile,
  fileLocation: PathLike,
  callback?: Function
): Promise<void> {
  let fileErrors = [];
  let fileBuffer: Buffer;
  let form;
  let file;

  // TODO add browser support for file chunking
  if (isBrowser) {
    return Promise.reject("Currently not compatible with browsers yet.");
  }
  let data = fs.statSync(fileLocation);
  let fileName = fileLocation.toString().split("/")[-1];
  let parts = Math.ceil(data.size / FILE_CHUNK_SIZE);
  const promises = [];
  for (let index = 0; index < parts; index++) {
    promises.push();
  }
  // console.log("aye should be doing things");
  // Initiate the multipart upload first

  // Once multipart upload is initiated, then can move on to reading file in chunks and uploading
  // Once chunked file is uploaded in parts, complete the multipart
  // If there's an error, abort the multipart upload and let the user know of the error
}
