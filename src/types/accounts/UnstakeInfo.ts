import { web3, BN } from "@coral-xyz/anchor";
import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId";

export interface UnstakeInfoFields {
  timeLastUnstaked: BN;
  epochLastUnstaked: BN;
  unstaker: web3.PublicKey;
}

export interface UnstakeInfoJSON {
  timeLastUnstaked: string;
  epochLastUnstaked: string;
  unstaker: string;
}

export class UnstakeInfo {
  readonly timeLastUnstaked: BN;
  readonly epochLastUnstaked: BN;
  readonly unstaker: web3.PublicKey;

  static readonly discriminator = Buffer.from([
    35, 204, 218, 156, 35, 179, 155, 198,
  ]);

  static readonly layout = borsh.struct([
    borsh.i64("timeLastUnstaked"),
    borsh.u64("epochLastUnstaked"),
    borsh.publicKey("unstaker"),
  ]);

  constructor(fields: UnstakeInfoFields) {
    this.timeLastUnstaked = fields.timeLastUnstaked;
    this.epochLastUnstaked = fields.epochLastUnstaked;
    this.unstaker = fields.unstaker;
  }

  static async fetch(
    c: web3.Connection,
    address: web3.PublicKey
  ): Promise<UnstakeInfo | null> {
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
  ): Promise<Array<UnstakeInfo | null>> {
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

  static decode(data: Buffer): UnstakeInfo {
    if (!data.slice(0, 8).equals(UnstakeInfo.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = UnstakeInfo.layout.decode(data.slice(8));

    return new UnstakeInfo({
      timeLastUnstaked: dec.timeLastUnstaked,
      epochLastUnstaked: dec.epochLastUnstaked,
      unstaker: dec.unstaker,
    });
  }

  toJSON(): UnstakeInfoJSON {
    return {
      timeLastUnstaked: this.timeLastUnstaked.toString(),
      epochLastUnstaked: this.epochLastUnstaked.toString(),
      unstaker: this.unstaker.toString(),
    };
  }

  static fromJSON(obj: UnstakeInfoJSON): UnstakeInfo {
    return new UnstakeInfo({
      timeLastUnstaked: new BN(obj.timeLastUnstaked),
      epochLastUnstaked: new BN(obj.epochLastUnstaked),
      unstaker: new web3.PublicKey(obj.unstaker),
    });
  }
}
