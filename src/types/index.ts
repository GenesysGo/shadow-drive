import { PublicKey } from "@solana/web3.js";

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
  version: "V1" | "V2";
};

export type ShadowFile = {
  name?: string;
  file: Buffer;
};
