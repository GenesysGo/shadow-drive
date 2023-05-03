import { Program, Wallet, web3 } from "@project-serum/anchor";
import {
  getStorageConfigPDA,
  getUserInfo,
  getAnchorEnvironmet,
} from "./utils/helpers";
import { ShadowDriveUserStaking } from "./utils/idl";
import {
  createStorageAccount,
  addStorage,
  claimStake,
  deleteFile,
  deleteStorageAccount,
  editFile,
  getStorageAcc,
  getStorageAccs,
  makeStorageImmutable,
  reduceStorage,
  cancelDeleteFile,
  cancelDeleteStorageAccount,
  uploadFile,
  uploadMultipleFiles,
  listObjects,
  redeemRent,
  migrate,
  topUp,
  refreshStake,
} from "./methods";

import {
  ShadowDriveVersion,
  CreateStorageResponse,
  ShadowBatchUploadResponse,
  ShadowDriveResponse,
  ShadowFile,
  ShadowUploadResponse,
  ShadowEditResponse,
  StorageAccount,
  StorageAccountResponse,
  ListObjectsResponse,
  StorageAccountInfo,
} from "./types";
interface ShadowDrive {
  createStorageAccount(
    name: string,
    size: string,
    version: ShadowDriveVersion,
    owner2: web3.PublicKey
  ): Promise<CreateStorageResponse>;
  addStorage(
    key: web3.PublicKey,
    size: string,
    version: ShadowDriveVersion
  ): Promise<ShadowDriveResponse>;
  claimStake(
    key: web3.PublicKey,
    version: ShadowDriveVersion
  ): Promise<{ txid: string }>;
  deleteFile(
    key: web3.PublicKey,
    url: string,
    version: ShadowDriveVersion
  ): Promise<ShadowDriveResponse>;
  editFile(
    key: web3.PublicKey,
    url: string,
    data: File | ShadowFile,
    version: ShadowDriveVersion
  ): Promise<ShadowEditResponse>;
  getStorageAcc?(key: web3.PublicKey): Promise<StorageAccount>;
  getStorageAccs?(): Promise<StorageAccount[]>;
  listObjects(key: web3.PublicKey): Promise<ListObjectsResponse>;
  makeStorageImmutable(
    key: web3.PublicKey,
    version: ShadowDriveVersion
  ): Promise<ShadowDriveResponse>;
  getStorageAccount(key: web3.PublicKey): Promise<StorageAccountInfo>;
  getStorageAccounts(
    version: ShadowDriveVersion
  ): Promise<StorageAccountResponse[]>;
  reduceStorage(
    key: web3.PublicKey,
    size: string,
    version: ShadowDriveVersion
  ): Promise<ShadowDriveResponse>;
  cancelDeleteFile(key: web3.PublicKey, url: string): Promise<{ txid: string }>;
  cancelDeleteStorageAccount(
    key: web3.PublicKey,
    version: ShadowDriveVersion
  ): Promise<{ txid: string }>;
  uploadFile(
    key: web3.PublicKey,
    data: File | ShadowFile,
    version: ShadowDriveVersion
  ): Promise<ShadowUploadResponse>;
  uploadMultipleFiles(
    key: web3.PublicKey,
    data: FileList | ShadowFile[],
    concurrent?: number,
    callback?: Function
  ): Promise<ShadowBatchUploadResponse[]>;
  deleteStorageAccount(
    key: web3.PublicKey,
    version: ShadowDriveVersion
  ): Promise<{ txid: string }>;
  redeemRent(
    key: web3.PublicKey,
    fileAccount: web3.PublicKey
  ): Promise<{ txid: string }>;
  migrate(key: web3.PublicKey): Promise<{ txid: string }>;
  topUp(key: web3.PublicKey, amount: number): Promise<{ txid: string }>;
  refreshStake(
    key: web3.PublicKey,
    version: ShadowDriveVersion
  ): Promise<{ txid: string }>;
}
/**
 *
 * Todo - Typescript does not currently support splitting up class definition into multiple files. These methods
 * are therefore added as properties to the ShdwDrive class. Can move all method definitions into this file to resolve.
 *
 */
export class ShdwDrive implements ShadowDrive {
  private program: Program<ShadowDriveUserStaking>;
  public storageConfigPDA: web3.PublicKey;
  public userInfo: web3.PublicKey;
  createStorageAccount = createStorageAccount;
  addStorage = addStorage;
  claimStake = claimStake;
  deleteFile = deleteFile;
  deleteStorageAccount = deleteStorageAccount;
  editFile = editFile;
  getStorageAccount = getStorageAcc;
  getStorageAccounts = getStorageAccs;
  listObjects = listObjects;
  makeStorageImmutable = makeStorageImmutable;
  reduceStorage = reduceStorage;
  topUp = topUp;
  refreshStake = refreshStake;
  /**
   * @deprecated The method should not be used as of Shadow Drive v1.5
   */
  cancelDeleteFile = cancelDeleteFile;
  cancelDeleteStorageAccount = cancelDeleteStorageAccount;
  uploadFile = uploadFile;
  uploadMultipleFiles = uploadMultipleFiles;
  redeemRent = redeemRent;
  migrate = migrate;
  /**
   *
   * @param connection {web3.Connection} connection - initialized web3 connection object
   * @param wallet - Web3 wallet
   */
  constructor(private connection: web3.Connection, private wallet: any) {
    this.wallet = wallet;
    this.connection = connection;
    const [program, provider] = getAnchorEnvironmet(wallet, connection);
    this.program = program;
  }
  public async init(): Promise<ShdwDrive> {
    if (!this.wallet && !this.wallet.publicKey) {
      return;
    }
    this.storageConfigPDA = (await getStorageConfigPDA(this.program))[0];
    this.userInfo = (await getUserInfo(this.program, this.wallet.publicKey))[0];
    return this;
  }
}

export {
  ShadowDriveVersion,
  CreateStorageResponse,
  ShadowDriveResponse,
  ShadowUploadResponse,
  ShadowEditResponse,
  ShadowFile,
  StorageAccount,
  StorageAccountResponse,
  ShadowBatchUploadResponse,
  ListObjectsResponse,
  StorageAccountInfo,
};
