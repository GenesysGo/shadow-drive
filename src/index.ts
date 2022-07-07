import { Program, Wallet, Provider, web3 } from "@project-serum/anchor";
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
} from "./methods";

import {
  CreateStorageResponse,
  ShadowBatchUploadResponse,
  ShadowDriveResponse,
  ShadowFile,
  ShadowUploadResponse,
  StorageAccount,
  StorageAccountResponse,
  ListObjectsResponse,
  StorageAccountInfo,
} from "./types";
interface ShadowDrive {
  createStorageAccount(
    name: string,
    size: string,
    version: string,
    owner2: web3.PublicKey
  ): Promise<CreateStorageResponse>;
  addStorage(
    key: web3.PublicKey,
    size: string,
    version: string
  ): Promise<ShadowDriveResponse>;
  claimStake(
    key: web3.PublicKey,
    version: string
  ): Promise<ShadowDriveResponse>;
  deleteFile(
    key: web3.PublicKey,
    url: string,
    version: string
  ): Promise<ShadowDriveResponse>;
  editFile(
    key: web3.PublicKey,
    url: string,
    data: File | ShadowFile,
    version: string
  ): Promise<ShadowUploadResponse>;
  getStorageAcc?(key: web3.PublicKey): Promise<StorageAccount>;
  getStorageAccs?(): Promise<StorageAccount[]>;
  listObjects(key: web3.PublicKey): Promise<ListObjectsResponse>;
  makeStorageImmutable(
    key: web3.PublicKey,
    version: string
  ): Promise<ShadowDriveResponse>;
  getStorageAccount(key: web3.PublicKey): Promise<StorageAccountInfo>;
  getStorageAccounts(version: string): Promise<StorageAccountResponse[]>;
  reduceStorage(
    key: web3.PublicKey,
    size: string,
    version: string
  ): Promise<ShadowDriveResponse>;
  cancelDeleteFile(
    key: web3.PublicKey,
    url: string
  ): Promise<ShadowDriveResponse>;
  cancelDeleteStorageAccount(
    key: web3.PublicKey,
    version: string
  ): Promise<ShadowDriveResponse>;
  uploadFile(
    key: web3.PublicKey,
    data: File | ShadowFile,
    version: string
  ): Promise<ShadowUploadResponse>;
  uploadMultipleFiles(
    key: web3.PublicKey,
    data: FileList | ShadowFile[]
  ): Promise<ShadowBatchUploadResponse[]>;
  deleteStorageAccount(
    key: web3.PublicKey,
    version: string
  ): Promise<ShadowDriveResponse>;
  redeemRent(
    key: web3.PublicKey,
    fileAccount: web3.PublicKey
  ): Promise<ShadowDriveResponse>;
  migrate(key: web3.PublicKey): Promise<ShadowDriveResponse>;
}

export class ShdwDrive implements ShadowDrive {
  private provider: Provider;
  private program: Program<ShadowDriveUserStaking>;
  private storageConfigPDA: web3.PublicKey;
  private userInfo: web3.PublicKey;
  /**
   *
   * Todo - Typescript does not currently support splitting up class definition into multiple files. These methods
   * are therefore added as properties to the ShdwDrive class. Can move all method definitions into this file to resolve.
   *
   */
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
  /**
   * @deprecated The method should not be used as of Shadow Drive v1.5
   */
  cancelDeleteFile = cancelDeleteFile;
  cancelDeleteStorageAccount = cancelDeleteStorageAccount;
  uploadFile = uploadFile;
  uploadMultipleFiles = uploadMultipleFiles;
  redeemRent = redeemRent;
  migrate = migrate;

  //Todo - check that the wallet passed in is able to sign messages
  constructor(private connection: web3.Connection, private wallet: any) {
    this.wallet = wallet;
    const [program, provider] = getAnchorEnvironmet(wallet, connection);
    this.connection = provider.connection;
    this.provider = provider;
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
  CreateStorageResponse,
  ShadowDriveResponse,
  ShadowUploadResponse,
  ShadowFile,
  StorageAccount,
  StorageAccountResponse,
  ShadowBatchUploadResponse,
  ListObjectsResponse,
  StorageAccountInfo,
};
