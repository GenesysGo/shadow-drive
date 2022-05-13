import { PublicKey } from "@solana/web3.js";

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

export type StorageAccount = {
  isStatic: boolean;
  initCounter: number;
  delCounter: number;
  immutable: boolean;
  toBeDeleted: boolean;
  deleteRequestEpoch: number;
  storage: number;
  storageAvailable: number;
  owner1: PublicKey;
  owner2: PublicKey;
  shdwPayer: PublicKey;
  accountCounterSeed: number;
  totalCostOfCurrentStorage: number;
  totalFeesPaid: number;
  creationTime: number;
  creationEpoch: number;
  lastFeeEpoch: number;
  identifier: string;
};
