import * as anchor from "@project-serum/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";

export type CreateStorageResponse = {
  shdw_bucket: string;
  transaction_signature: string;
};

export type ShadowDriveResponse = {
  txid: string;
};

export type ShadowUploadResponse = {
  finalized_locations: Array<string>;
  message: string;
  upload_errors: Array<UploadError>;
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
  delet_request_epoch: number;
  owner1: PublicKey;
  account_counter_seed: number;
  creation_time: number;
  creation_epoch: number;
  last_fee_epoch: number;
  identifier: string;
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

export type FileAccount = {
  immutable: boolean;
  toBeDeleted: boolean;
  deleteRequestEpoch: number;
  size: number;
  sha256Hash: number;
  initCounterSeed: number;
  storageAccount: anchor.web3.PublicKey;
  name: string;
};
