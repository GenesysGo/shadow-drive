import { Program, Wallet, Provider } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
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
  ShadowDriveResponse,
  ShadowUploadResponse,
  StorageAccount,
} from "./types";
import FormData from "form-data";
interface ShadowDrive {
  createStorageAccount?(
    name: string,
    size: string
  ): Promise<CreateStorageResponse>;
  addStorage?(key: PublicKey, size: string): Promise<ShadowDriveResponse>;
  claimStake?(key: PublicKey): Promise<ShadowDriveResponse>;
  deleteFile?(key: PublicKey, url: string): Promise<ShadowDriveResponse>;
  editFile?(
    key: PublicKey,
    url: string,
    data: FormData
  ): Promise<ShadowUploadResponse>;
  getStorageAcc?(key: PublicKey): Promise<StorageAccount>;
  getStorageAccs?(): Promise<StorageAccount[]>;
  makeStorageImmutable?(key: PublicKey): Promise<ShadowDriveResponse>;
  reduceStorage?(key: PublicKey, size: string): Promise<ShadowDriveResponse>;
  cancelDeleteFile?(key: PublicKey, url: string): Promise<ShadowDriveResponse>;
  cancelDeleteStorageAccount?(key: PublicKey): Promise<ShadowDriveResponse>;
  uploadFile?(key: PublicKey, data: FormData): Promise<ShadowUploadResponse>;
  //Todo update params here, array of upload files with formdata as a key
  //   uploadMultipleFiles?(
  //     key: PublicKey,
  //     size: string,
  //     data: FormData[]
  //   ): Promise<Error | Object>;
  deleteStorageAccount?(key: PublicKey): Promise<ShadowDriveResponse>;
}

export default class ShdwDrive implements ShadowDrive {
  private provider: Provider;
  private program: Program<ShadowDriveUserStaking>;
  private storageConfigPDA: PublicKey;
  private userInfo: PublicKey;
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
  //   uploadMultipleFiles = uploadMultipleFiles;

  constructor(
    private connection: Connection,
    private wallet: Wallet | AnchorWallet
  ) {
    this.connection = connection;
    this.wallet = wallet;
    const [program, provider] = getAnchorEnvironmet(
      wallet as Wallet,
      connection
    );
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

export { CreateStorageResponse, ShadowDriveResponse, ShadowUploadResponse };
