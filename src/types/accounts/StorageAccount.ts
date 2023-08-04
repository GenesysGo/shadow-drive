import { PublicKey, Connection } from "@solana/web3.js";
import BN from "bn.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId";

export interface StorageAccountFields {
  /**
   * Immutable boolean to track what kind of storage account this is.
   * NOTE: Not used in current implementation w/ non-dynamic storage payments
   */
  isStatic: boolean;
  /**
   * Flag on whether storage account is public (usable by anyone)
   * Counter tracking how many files have been initialized
   */
  initCounter: number;
  /** Counter tracking how many files have been deleted */
  delCounter: number;
  /** Boolean to track whether storage account (and all child File accounts) are immutable */
  immutable: boolean;
  /** Delete flag */
  toBeDeleted: boolean;
  /** Delete request epoch */
  deleteRequestEpoch: number;
  /** Number of bytes of storage associated with this account */
  storage: BN;
  /** Bytes available for use */
  storageAvailable: BN;
  /** Primary owner of StorageAccount (immutable) */
  owner1: PublicKey;
  /** Optional owner 2 */
  owner2: PublicKey;
  /** Pubkey of the token account that staked SHDW */
  shdwPayer: PublicKey;
  /** Counter at time of initialization */
  accountCounterSeed: number;
  /** Total shades paid for current box size */
  totalCostOfCurrentStorage: BN;
  totalFeesPaid: BN;
  /** Time of storage account creation */
  creationTime: number;
  /** Time of storage account creation */
  creationEpoch: number;
  /** The last epoch through which the user paid */
  lastFeeEpoch: number;
  /**
   * Some unique identifier that the user provides.
   * Serves as a seed for storage account PDA.
   */
  identifier: string;
}

export interface StorageAccountJSON {
  /**
   * Immutable boolean to track what kind of storage account this is.
   * NOTE: Not used in current implementation w/ non-dynamic storage payments
   */
  isStatic: boolean;
  /**
   * Flag on whether storage account is public (usable by anyone)
   * Counter tracking how many files have been initialized
   */
  initCounter: number;
  /** Counter tracking how many files have been deleted */
  delCounter: number;
  /** Boolean to track whether storage account (and all child File accounts) are immutable */
  immutable: boolean;
  /** Delete flag */
  toBeDeleted: boolean;
  /** Delete request epoch */
  deleteRequestEpoch: number;
  /** Number of bytes of storage associated with this account */
  storage: string;
  /** Bytes available for use */
  storageAvailable: string;
  /** Primary owner of StorageAccount (immutable) */
  owner1: string;
  /** Optional owner 2 */
  owner2: string;
  /** Pubkey of the token account that staked SHDW */
  shdwPayer: string;
  /** Counter at time of initialization */
  accountCounterSeed: number;
  /** Total shades paid for current box size */
  totalCostOfCurrentStorage: string;
  totalFeesPaid: string;
  /** Time of storage account creation */
  creationTime: number;
  /** Time of storage account creation */
  creationEpoch: number;
  /** The last epoch through which the user paid */
  lastFeeEpoch: number;
  /**
   * Some unique identifier that the user provides.
   * Serves as a seed for storage account PDA.
   */
  identifier: string;
}

export class StorageAccount {
  /**
   * Immutable boolean to track what kind of storage account this is.
   * NOTE: Not used in current implementation w/ non-dynamic storage payments
   */
  readonly isStatic: boolean;
  /**
   * Flag on whether storage account is public (usable by anyone)
   * Counter tracking how many files have been initialized
   */
  readonly initCounter: number;
  /** Counter tracking how many files have been deleted */
  readonly delCounter: number;
  /** Boolean to track whether storage account (and all child File accounts) are immutable */
  readonly immutable: boolean;
  /** Delete flag */
  readonly toBeDeleted: boolean;
  /** Delete request epoch */
  readonly deleteRequestEpoch: number;
  /** Number of bytes of storage associated with this account */
  readonly storage: BN;
  /** Bytes available for use */
  readonly storageAvailable: BN;
  /** Primary owner of StorageAccount (immutable) */
  readonly owner1: PublicKey;
  /** Optional owner 2 */
  readonly owner2: PublicKey;
  /** Pubkey of the token account that staked SHDW */
  readonly shdwPayer: PublicKey;
  /** Counter at time of initialization */
  readonly accountCounterSeed: number;
  /** Total shades paid for current box size */
  readonly totalCostOfCurrentStorage: BN;
  readonly totalFeesPaid: BN;
  /** Time of storage account creation */
  readonly creationTime: number;
  /** Time of storage account creation */
  readonly creationEpoch: number;
  /** The last epoch through which the user paid */
  readonly lastFeeEpoch: number;
  /**
   * Some unique identifier that the user provides.
   * Serves as a seed for storage account PDA.
   */
  readonly identifier: string;

  static readonly discriminator = Buffer.from([
    41, 48, 231, 194, 22, 77, 205, 235,
  ]);

  static readonly layout = borsh.struct([
    borsh.bool("isStatic"),
    borsh.u32("initCounter"),
    borsh.u32("delCounter"),
    borsh.bool("immutable"),
    borsh.bool("toBeDeleted"),
    borsh.u32("deleteRequestEpoch"),
    borsh.u64("storage"),
    borsh.u64("storageAvailable"),
    borsh.publicKey("owner1"),
    borsh.publicKey("owner2"),
    borsh.publicKey("shdwPayer"),
    borsh.u32("accountCounterSeed"),
    borsh.u64("totalCostOfCurrentStorage"),
    borsh.u64("totalFeesPaid"),
    borsh.u32("creationTime"),
    borsh.u32("creationEpoch"),
    borsh.u32("lastFeeEpoch"),
    borsh.str("identifier"),
  ]);

  constructor(fields: StorageAccountFields) {
    this.isStatic = fields.isStatic;
    this.initCounter = fields.initCounter;
    this.delCounter = fields.delCounter;
    this.immutable = fields.immutable;
    this.toBeDeleted = fields.toBeDeleted;
    this.deleteRequestEpoch = fields.deleteRequestEpoch;
    this.storage = fields.storage;
    this.storageAvailable = fields.storageAvailable;
    this.owner1 = fields.owner1;
    this.owner2 = fields.owner2;
    this.shdwPayer = fields.shdwPayer;
    this.accountCounterSeed = fields.accountCounterSeed;
    this.totalCostOfCurrentStorage = fields.totalCostOfCurrentStorage;
    this.totalFeesPaid = fields.totalFeesPaid;
    this.creationTime = fields.creationTime;
    this.creationEpoch = fields.creationEpoch;
    this.lastFeeEpoch = fields.lastFeeEpoch;
    this.identifier = fields.identifier;
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<StorageAccount | null> {
    const info = await c.getAccountInfo(address);
    if (info === null) {
      return null;
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program");
    }
    return this.decode(info.data);
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<StorageAccount | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): StorageAccount {
    if (!data.slice(0, 8).equals(StorageAccount.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = StorageAccount.layout.decode(data.slice(8));

    return new StorageAccount({
      isStatic: dec.isStatic,
      initCounter: dec.initCounter,
      delCounter: dec.delCounter,
      immutable: dec.immutable,
      toBeDeleted: dec.toBeDeleted,
      deleteRequestEpoch: dec.deleteRequestEpoch,
      storage: dec.storage,
      storageAvailable: dec.storageAvailable,
      owner1: dec.owner1,
      owner2: dec.owner2,
      shdwPayer: dec.shdwPayer,
      accountCounterSeed: dec.accountCounterSeed,
      totalCostOfCurrentStorage: dec.totalCostOfCurrentStorage,
      totalFeesPaid: dec.totalFeesPaid,
      creationTime: dec.creationTime,
      creationEpoch: dec.creationEpoch,
      lastFeeEpoch: dec.lastFeeEpoch,
      identifier: dec.identifier,
    });
  }

  toJSON(): StorageAccountJSON {
    return {
      isStatic: this.isStatic,
      initCounter: this.initCounter,
      delCounter: this.delCounter,
      immutable: this.immutable,
      toBeDeleted: this.toBeDeleted,
      deleteRequestEpoch: this.deleteRequestEpoch,
      storage: this.storage.toString(),
      storageAvailable: this.storageAvailable.toString(),
      owner1: this.owner1.toString(),
      owner2: this.owner2.toString(),
      shdwPayer: this.shdwPayer.toString(),
      accountCounterSeed: this.accountCounterSeed,
      totalCostOfCurrentStorage: this.totalCostOfCurrentStorage.toString(),
      totalFeesPaid: this.totalFeesPaid.toString(),
      creationTime: this.creationTime,
      creationEpoch: this.creationEpoch,
      lastFeeEpoch: this.lastFeeEpoch,
      identifier: this.identifier,
    };
  }

  static fromJSON(obj: StorageAccountJSON): StorageAccount {
    return new StorageAccount({
      isStatic: obj.isStatic,
      initCounter: obj.initCounter,
      delCounter: obj.delCounter,
      immutable: obj.immutable,
      toBeDeleted: obj.toBeDeleted,
      deleteRequestEpoch: obj.deleteRequestEpoch,
      storage: new BN(obj.storage),
      storageAvailable: new BN(obj.storageAvailable),
      owner1: new PublicKey(obj.owner1),
      owner2: new PublicKey(obj.owner2),
      shdwPayer: new PublicKey(obj.shdwPayer),
      accountCounterSeed: obj.accountCounterSeed,
      totalCostOfCurrentStorage: new BN(obj.totalCostOfCurrentStorage),
      totalFeesPaid: new BN(obj.totalFeesPaid),
      creationTime: obj.creationTime,
      creationEpoch: obj.creationEpoch,
      lastFeeEpoch: obj.lastFeeEpoch,
      identifier: obj.identifier,
    });
  }
}
