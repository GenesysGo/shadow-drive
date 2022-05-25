import * as anchor from "@project-serum/anchor";

export type CreateStorageResponse = {
  shdw_bucket: string;
  transaction_signature: string;
};

export type ShadowDriveResponse = {
  txid: string;
};

export type ShadowUploadResponse = {
  finalized_location: string;
  transaction_signature: string;
};
export type ShadowBatchUploadResponse = {
  fileName: string;
  status: string;
  location: string;
  transaction_signature: string | null;
};
export type StorageAccountResponse = {
  publicKey: anchor.web3.PublicKey;
  account: StorageAccount;
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
