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
  makeStorageImmutable,
  reduceStorage,
  cancelDeleteFile,
  cancelDeleteStorageAccount,
  uploadFile,
  uploadMultipleFiles,
  getStorageAccs,
} from "./methods";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import {
  CreateStorageResponse,
  ShadowBatchUploadResponse,
  ShadowDriveResponse,
  ShadowFile,
  ShadowUploadResponse,
  StorageAccount,
  StorageAccountResponse,
} from "./types";
interface ShadowDrive {
  createStorageAccount(
    name: string,
    size: string
  ): Promise<CreateStorageResponse>;
  addStorage: (
    key: web3.PublicKey,
    size: string
  ) => Promise<ShadowDriveResponse>;
  claimStake?(key: web3.PublicKey): Promise<ShadowDriveResponse>;
  deleteFile?(key: web3.PublicKey, url: string): Promise<ShadowDriveResponse>;
  editFile?(
    key: web3.PublicKey,
    url: string,
    data: File | ShadowFile
  ): Promise<ShadowUploadResponse>;
  getStorageAcc?(key: web3.PublicKey): Promise<StorageAccount>;
  getStorageAccs?(): Promise<StorageAccount[]>;
  makeStorageImmutable?(key: web3.PublicKey): Promise<ShadowDriveResponse>;
  reduceStorage?(
    key: web3.PublicKey,
    size: string
  ): Promise<ShadowDriveResponse>;
  cancelDeleteFile?(
    key: web3.PublicKey,
    url: string
  ): Promise<ShadowDriveResponse>;
  cancelDeleteStorageAccount?(
    key: web3.PublicKey
  ): Promise<ShadowDriveResponse>;
  uploadFile?(
    key: web3.PublicKey,
    data: File | ShadowFile
  ): Promise<ShadowUploadResponse>;
  uploadMultipleFiles?(
    key: web3.PublicKey,
    data: FileList | ShadowFile[]
  ): Promise<ShadowBatchUploadResponse[]>;
  deleteStorageAccount?(key: web3.PublicKey): Promise<ShadowDriveResponse>;
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
  makeStorageImmutable = makeStorageImmutable;
  reduceStorage = reduceStorage;
  cancelDeleteFile = cancelDeleteFile;
  cancelDeleteStorageAccount = cancelDeleteStorageAccount;
  uploadFile = uploadFile;
  uploadMultipleFiles = uploadMultipleFiles;

  constructor(
    private connection: web3.Connection,
    private wallet: Wallet | AnchorWallet
  ) {
    this.wallet = wallet;
    const [program, provider] = getAnchorEnvironmet(
      wallet as Wallet,
      connection
    );
    this.connection = provider.connection;
    this.provider = provider;
    this.program = program;
  }
  public async init() {
    this.storageConfigPDA = (await getStorageConfigPDA(this.program))[0];
    const user = (await getUserInfo(this.program, this.wallet.publicKey))[0];
    if (user) {
      this.userInfo = user;
    }
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
};
