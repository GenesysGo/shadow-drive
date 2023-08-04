import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UserInfoFields {
  /** Total number of storage accounts the user has with us */
  accountCounter: number
  /** Total number of storage accounts that have been deleted */
  delCounter: number
  /** Boolean denoting that the user agreed to terms of service */
  agreedToTos: boolean
  /** Boolean denoting whether this pubkey has ever had a bad scam scan */
  lifetimeBadCsam: boolean
}

export interface UserInfoJSON {
  /** Total number of storage accounts the user has with us */
  accountCounter: number
  /** Total number of storage accounts that have been deleted */
  delCounter: number
  /** Boolean denoting that the user agreed to terms of service */
  agreedToTos: boolean
  /** Boolean denoting whether this pubkey has ever had a bad scam scan */
  lifetimeBadCsam: boolean
}

export class UserInfo {
  /** Total number of storage accounts the user has with us */
  readonly accountCounter: number
  /** Total number of storage accounts that have been deleted */
  readonly delCounter: number
  /** Boolean denoting that the user agreed to terms of service */
  readonly agreedToTos: boolean
  /** Boolean denoting whether this pubkey has ever had a bad scam scan */
  readonly lifetimeBadCsam: boolean

  static readonly discriminator = Buffer.from([
    83, 134, 200, 56, 144, 56, 10, 62,
  ])

  static readonly layout = borsh.struct([
    borsh.u32("accountCounter"),
    borsh.u32("delCounter"),
    borsh.bool("agreedToTos"),
    borsh.bool("lifetimeBadCsam"),
  ])

  constructor(fields: UserInfoFields) {
    this.accountCounter = fields.accountCounter
    this.delCounter = fields.delCounter
    this.agreedToTos = fields.agreedToTos
    this.lifetimeBadCsam = fields.lifetimeBadCsam
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<UserInfo | null> {
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
  ): Promise<Array<UserInfo | null>> {
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

  static decode(data: Buffer): UserInfo {
    if (!data.slice(0, 8).equals(UserInfo.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = UserInfo.layout.decode(data.slice(8))

    return new UserInfo({
      accountCounter: dec.accountCounter,
      delCounter: dec.delCounter,
      agreedToTos: dec.agreedToTos,
      lifetimeBadCsam: dec.lifetimeBadCsam,
    })
  }

  toJSON(): UserInfoJSON {
    return {
      accountCounter: this.accountCounter,
      delCounter: this.delCounter,
      agreedToTos: this.agreedToTos,
      lifetimeBadCsam: this.lifetimeBadCsam,
    }
  }

  static fromJSON(obj: UserInfoJSON): UserInfo {
    return new UserInfo({
      accountCounter: obj.accountCounter,
      delCounter: obj.delCounter,
      agreedToTos: obj.agreedToTos,
      lifetimeBadCsam: obj.lifetimeBadCsam,
    })
  }
}
