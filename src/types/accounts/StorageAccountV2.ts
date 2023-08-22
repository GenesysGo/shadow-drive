import { web3, BN } from "@coral-xyz/anchor";
import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId";

export interface StorageAccountV2Fields {
  /** Boolean to track whether storage account (and all child File accounts) are immutable */
  immutable: boolean;
  /** Delete flag */
  toBeDeleted: boolean;
  /** Delete request epoch */
  deleteRequestEpoch: number;
  /** Number of bytes of storage associated with this account */
  storage: BN;
  /** Primary owner of StorageAccount (immutable) */
  owner1: web3.PublicKey;
  /**
   * Pubkey of the token account that staked SHDW
   * Counter at time of initialization
   */
  accountCounterSeed: number;
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

export interface StorageAccountV2JSON {
  /** Boolean to track whether storage account (and all child File accounts) are immutable */
  immutable: boolean;
  /** Delete flag */
  toBeDeleted: boolean;
  /** Delete request epoch */
  deleteRequestEpoch: number;
  /** Number of bytes of storage associated with this account */
  storage: string;
  /** Primary owner of StorageAccount (immutable) */
  owner1: string;
  /**
   * Pubkey of the token account that staked SHDW
   * Counter at time of initialization
   */
  accountCounterSeed: number;
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

export class StorageAccountV2 {
  /** Boolean to track whether storage account (and all child File accounts) are immutable */
  readonly immutable: boolean;
  /** Delete flag */
  readonly toBeDeleted: boolean;
  /** Delete request epoch */
  readonly deleteRequestEpoch: number;
  /** Number of bytes of storage associated with this account */
  readonly storage: BN;
  /** Primary owner of StorageAccount (immutable) */
  readonly owner1: web3.PublicKey;
  /**
   * Pubkey of the token account that staked SHDW
   * Counter at time of initialization
   */
  readonly accountCounterSeed: number;
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
    133, 53, 253, 82, 212, 5, 201, 218,
  ]);

  static readonly layout = borsh.struct([
    borsh.bool("immutable"),
    borsh.bool("toBeDeleted"),
    borsh.u32("deleteRequestEpoch"),
    borsh.u64("storage"),
    borsh.publicKey("owner1"),
    borsh.u32("accountCounterSeed"),
    borsh.u32("creationTime"),
    borsh.u32("creationEpoch"),
    borsh.u32("lastFeeEpoch"),
    borsh.str("identifier"),
  ]);

  constructor(fields: StorageAccountV2Fields) {
    this.immutable = fields.immutable;
    this.toBeDeleted = fields.toBeDeleted;
    this.deleteRequestEpoch = fields.deleteRequestEpoch;
    this.storage = fields.storage;
    this.owner1 = fields.owner1;
    this.accountCounterSeed = fields.accountCounterSeed;
    this.creationTime = fields.creationTime;
    this.creationEpoch = fields.creationEpoch;
    this.lastFeeEpoch = fields.lastFeeEpoch;
    this.identifier = fields.identifier;
  }

  static async fetch(
    c: web3.Connection,
    address: web3.PublicKey
  ): Promise<StorageAccountV2 | null> {
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
    c: web3.Connection,
    addresses: web3.PublicKey[]
  ): Promise<Array<StorageAccountV2 | null>> {
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

  static decode(data: Buffer): StorageAccountV2 {
    if (!data.slice(0, 8).equals(StorageAccountV2.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = StorageAccountV2.layout.decode(data.slice(8));

    return new StorageAccountV2({
      immutable: dec.immutable,
      toBeDeleted: dec.toBeDeleted,
      deleteRequestEpoch: dec.deleteRequestEpoch,
      storage: dec.storage,
      owner1: dec.owner1,
      accountCounterSeed: dec.accountCounterSeed,
      creationTime: dec.creationTime,
      creationEpoch: dec.creationEpoch,
      lastFeeEpoch: dec.lastFeeEpoch,
      identifier: dec.identifier,
    });
  }

  toJSON(): StorageAccountV2JSON {
    return {
      immutable: this.immutable,
      toBeDeleted: this.toBeDeleted,
      deleteRequestEpoch: this.deleteRequestEpoch,
      storage: this.storage.toString(),
      owner1: this.owner1.toString(),
      accountCounterSeed: this.accountCounterSeed,
      creationTime: this.creationTime,
      creationEpoch: this.creationEpoch,
      lastFeeEpoch: this.lastFeeEpoch,
      identifier: this.identifier,
    };
  }

  static fromJSON(obj: StorageAccountV2JSON): StorageAccountV2 {
    return new StorageAccountV2({
      immutable: obj.immutable,
      toBeDeleted: obj.toBeDeleted,
      deleteRequestEpoch: obj.deleteRequestEpoch,
      storage: new BN(obj.storage),
      owner1: new web3.PublicKey(obj.owner1),
      accountCounterSeed: obj.accountCounterSeed,
      creationTime: obj.creationTime,
      creationEpoch: obj.creationEpoch,
      lastFeeEpoch: obj.lastFeeEpoch,
      identifier: obj.identifier,
    });
  }
}
