import { Program, web3 } from "@coral-xyz/anchor";
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
  cancelDeleteStorageAccount,
  uploadFile,
  uploadMultipleFiles,
  listObjects,
  migrate,
  topUp,
  refreshStake,
  getStorageAccInfo,
} from "./methods";
import {
  StorageAccount,
  StorageAccountV2,
  StorageConfig,
  UserInfo,
  UnstakeInfo,
} from "./types/accounts";
import * as ShadowDriveInstructionTypes from "./types/index";
import * as Errors from "./types/errors/custom";
import {
  CreateStorageResponse,
  ShadowBatchUploadResponse,
  ShadowDriveResponse,
  ShadowFile,
  ShadowUploadResponse,
  ShadowEditResponse,
  ListObjectsResponse,
  StorageAccountInfo,
} from "./types";
interface ShadowDrive {
  createStorageAccount(
    name: string,
    size: string,
    owner2: web3.PublicKey
  ): Promise<CreateStorageResponse>;
  addStorage(key: web3.PublicKey, size: string): Promise<ShadowDriveResponse>;
  claimStake(key: web3.PublicKey): Promise<{ txid: string }>;
  deleteFile(key: web3.PublicKey, url: string): Promise<ShadowDriveResponse>;
  editFile(
    key: web3.PublicKey,
    url: string,
    data: File | ShadowFile
  ): Promise<ShadowEditResponse>;
  getStorageAcc?(key: web3.PublicKey): Promise<StorageAccount>;
  getStorageAccs?(): Promise<StorageAccount[]>;
  listObjects(key: web3.PublicKey): Promise<ListObjectsResponse>;
  makeStorageImmutable(key: web3.PublicKey): Promise<ShadowDriveResponse>;
  getStorageAccount(key: web3.PublicKey): Promise<{
    publicKey: web3.PublicKey;
    account: StorageAccountV2;
  }>;
  getStorageAccountInfo(key: web3.PublicKey): Promise<StorageAccountInfo>;
  getStorageAccounts(): Promise<
    Array<{
      publicKey: web3.PublicKey;
      account: StorageAccount | StorageAccountV2;
    }>
  >;
  reduceStorage(
    key: web3.PublicKey,
    size: string
  ): Promise<ShadowDriveResponse>;
  cancelDeleteStorageAccount(key: web3.PublicKey): Promise<{ txid: string }>;
  uploadFile(
    key: web3.PublicKey,
    data: File | ShadowFile
  ): Promise<ShadowUploadResponse>;
  uploadMultipleFiles(
    key: web3.PublicKey,
    data: FileList | ShadowFile[],
    concurrent?: number,
    callback?: Function
  ): Promise<ShadowBatchUploadResponse[]>;
  deleteStorageAccount(key: web3.PublicKey): Promise<{ txid: string }>;
  migrate(
    key: web3.PublicKey
  ): Promise<{ step1_sig: string; step2_sig: string }>;
  topUp(key: web3.PublicKey, amount: number): Promise<{ txid: string }>;
  refreshStake(key: web3.PublicKey): Promise<{ txid: string }>;
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
  getStorageAccountInfo = getStorageAccInfo;
  getStorageAccount = getStorageAcc;
  getStorageAccounts = getStorageAccs;
  listObjects = listObjects;
  makeStorageImmutable = makeStorageImmutable;
  reduceStorage = reduceStorage;
  topUp = topUp;
  refreshStake = refreshStake;
  cancelDeleteStorageAccount = cancelDeleteStorageAccount;
  uploadFile = uploadFile;
  uploadMultipleFiles = uploadMultipleFiles;
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
    [this.storageConfigPDA] = await getStorageConfigPDA(this.program);
    [this.userInfo] = await getUserInfo(this.program, this.wallet.publicKey);
    return this;
  }
}

export {
  CreateStorageResponse,
  ShadowDriveResponse,
  ShadowUploadResponse,
  ShadowEditResponse,
  ShadowFile,
  ShadowBatchUploadResponse,
  ListObjectsResponse,
  StorageAccountInfo,
  StorageAccount,
  StorageAccountV2,
  StorageConfig,
  UserInfo,
  UnstakeInfo,
  ShadowDriveInstructionTypes,
  Errors,
};
