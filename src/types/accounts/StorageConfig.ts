import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface StorageConfigFields {
  /** Storage costs in shades per GiB */
  shadesPerGib: BN
  /** Total storage available (or remaining) */
  storageAvailable: BN
  /** Pubkey of SHDW token account that holds storage fees/stake */
  tokenAccount: PublicKey
  /** Optional Admin 2 */
  admin2: PublicKey
  /** Uploader key, used to sign off on successful storage + CSAM scan */
  uploader: PublicKey
  /** Epoch at which mutable_account_fees turned on */
  mutableFeeStartEpoch: number | null
  /** Mutable fee rate */
  shadesPerGibPerEpoch: BN
  /** Basis points cranker gets from cranking */
  crankBps: number
  /** Maximum size of a storage account */
  maxAccountSize: BN
  /** Minimum size of a storage account */
  minAccountSize: BN
}

export interface StorageConfigJSON {
  /** Storage costs in shades per GiB */
  shadesPerGib: string
  /** Total storage available (or remaining) */
  storageAvailable: string
  /** Pubkey of SHDW token account that holds storage fees/stake */
  tokenAccount: string
  /** Optional Admin 2 */
  admin2: string
  /** Uploader key, used to sign off on successful storage + CSAM scan */
  uploader: string
  /** Epoch at which mutable_account_fees turned on */
  mutableFeeStartEpoch: number | null
  /** Mutable fee rate */
  shadesPerGibPerEpoch: string
  /** Basis points cranker gets from cranking */
  crankBps: number
  /** Maximum size of a storage account */
  maxAccountSize: string
  /** Minimum size of a storage account */
  minAccountSize: string
}

export class StorageConfig {
  /** Storage costs in shades per GiB */
  readonly shadesPerGib: BN
  /** Total storage available (or remaining) */
  readonly storageAvailable: BN
  /** Pubkey of SHDW token account that holds storage fees/stake */
  readonly tokenAccount: PublicKey
  /** Optional Admin 2 */
  readonly admin2: PublicKey
  /** Uploader key, used to sign off on successful storage + CSAM scan */
  readonly uploader: PublicKey
  /** Epoch at which mutable_account_fees turned on */
  readonly mutableFeeStartEpoch: number | null
  /** Mutable fee rate */
  readonly shadesPerGibPerEpoch: BN
  /** Basis points cranker gets from cranking */
  readonly crankBps: number
  /** Maximum size of a storage account */
  readonly maxAccountSize: BN
  /** Minimum size of a storage account */
  readonly minAccountSize: BN

  static readonly discriminator = Buffer.from([
    90, 136, 182, 122, 243, 186, 80, 201,
  ])

  static readonly layout = borsh.struct([
    borsh.u64("shadesPerGib"),
    borsh.u128("storageAvailable"),
    borsh.publicKey("tokenAccount"),
    borsh.publicKey("admin2"),
    borsh.publicKey("uploader"),
    borsh.option(borsh.u32(), "mutableFeeStartEpoch"),
    borsh.u64("shadesPerGibPerEpoch"),
    borsh.u16("crankBps"),
    borsh.u64("maxAccountSize"),
    borsh.u64("minAccountSize"),
  ])

  constructor(fields: StorageConfigFields) {
    this.shadesPerGib = fields.shadesPerGib
    this.storageAvailable = fields.storageAvailable
    this.tokenAccount = fields.tokenAccount
    this.admin2 = fields.admin2
    this.uploader = fields.uploader
    this.mutableFeeStartEpoch = fields.mutableFeeStartEpoch
    this.shadesPerGibPerEpoch = fields.shadesPerGibPerEpoch
    this.crankBps = fields.crankBps
    this.maxAccountSize = fields.maxAccountSize
    this.minAccountSize = fields.minAccountSize
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<StorageConfig | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<StorageConfig | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): StorageConfig {
    if (!data.slice(0, 8).equals(StorageConfig.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = StorageConfig.layout.decode(data.slice(8))

    return new StorageConfig({
      shadesPerGib: dec.shadesPerGib,
      storageAvailable: dec.storageAvailable,
      tokenAccount: dec.tokenAccount,
      admin2: dec.admin2,
      uploader: dec.uploader,
      mutableFeeStartEpoch: dec.mutableFeeStartEpoch,
      shadesPerGibPerEpoch: dec.shadesPerGibPerEpoch,
      crankBps: dec.crankBps,
      maxAccountSize: dec.maxAccountSize,
      minAccountSize: dec.minAccountSize,
    })
  }

  toJSON(): StorageConfigJSON {
    return {
      shadesPerGib: this.shadesPerGib.toString(),
      storageAvailable: this.storageAvailable.toString(),
      tokenAccount: this.tokenAccount.toString(),
      admin2: this.admin2.toString(),
      uploader: this.uploader.toString(),
      mutableFeeStartEpoch: this.mutableFeeStartEpoch,
      shadesPerGibPerEpoch: this.shadesPerGibPerEpoch.toString(),
      crankBps: this.crankBps,
      maxAccountSize: this.maxAccountSize.toString(),
      minAccountSize: this.minAccountSize.toString(),
    }
  }

  static fromJSON(obj: StorageConfigJSON): StorageConfig {
    return new StorageConfig({
      shadesPerGib: new BN(obj.shadesPerGib),
      storageAvailable: new BN(obj.storageAvailable),
      tokenAccount: new PublicKey(obj.tokenAccount),
      admin2: new PublicKey(obj.admin2),
      uploader: new PublicKey(obj.uploader),
      mutableFeeStartEpoch: obj.mutableFeeStartEpoch,
      shadesPerGibPerEpoch: new BN(obj.shadesPerGibPerEpoch),
      crankBps: obj.crankBps,
      maxAccountSize: new BN(obj.maxAccountSize),
      minAccountSize: new BN(obj.minAccountSize),
    })
  }
}
