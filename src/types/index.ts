import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export type ShadowDriveVersion = "v1" | "v2";

export type CreateStorageResponse = {
  shdw_bucket: string;
  transaction_signature: string;
};

export type ShadowDriveResponse = {
  message: string;
  transaction_signature?: string;
};

export type ShadowUploadResponse = {
  finalized_locations: Array<string>;
  message: string;
  upload_errors: Array<UploadError>;
};

export type ShadowEditResponse = {
  finalized_location: string;
};

export type UploadError = {
  file: string;
  storage_account: string;
  error: string;
};

export type ShadowBatchUploadResponse = {
  fileName: string;
  status: string;
  location: string;
};

export type ListObjectsResponse = {
  keys: string[];
};

export type ListObjectFileDetails = {
  file_name: string;
  size: number | bigint;
  last_modified: string | Date;
};

export type ListObjectsAndSizesResponse = {
  files: ListObjectFileDetails[];
};

export type StorageAccountResponse = {
  publicKey: anchor.web3.PublicKey;
  account: StorageAccount;
};

export type StorageAccountInfo = {
  storage_account: PublicKey;
  reserved_bytes: number;
  current_usage: number;
  immutable: boolean;
  to_be_deleted: boolean;
  delete_request_epoch: number;
  owner1: PublicKey;
  account_counter_seed: number;
  creation_time: number;
  creation_epoch: number;
  last_fee_epoch: number;
  identifier: string;
  version: `${Uppercase<ShadowDriveVersion>}`;
};

export type StorageAccount = {
  isStatic: boolean;
  initCounter: number;
  delCounter: number;
  immutable: boolean;
  toBeDeleted: boolean;
  deleteRequestEpoch: number;
  storage: number;
  storageAvailable: number;
  owner1: anchor.web3.PublicKey;
  owner2: anchor.web3.PublicKey;
  shdwPayer: anchor.web3.PublicKey;
  accountCounterSeed: number;
  totalCostOfCurrentStorage: number;
  totalFeesPaid: number;
  creationTime: number;
  creationEpoch: number;
  lastFeeEpoch: number;
  identifier: string;
};

export type ShadowFile = {
  name?: string;
  file: Buffer;
};
