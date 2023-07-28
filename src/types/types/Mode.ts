import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface IncrementJSON {
  kind: "Increment"
}

export class Increment {
  static readonly discriminator = 0
  static readonly kind = "Increment"
  readonly discriminator = 0
  readonly kind = "Increment"

  toJSON(): IncrementJSON {
    return {
      kind: "Increment",
    }
  }

  toEncodable() {
    return {
      Increment: {},
    }
  }
}

export interface DecrementJSON {
  kind: "Decrement"
}

export class Decrement {
  static readonly discriminator = 1
  static readonly kind = "Decrement"
  readonly discriminator = 1
  readonly kind = "Decrement"

  toJSON(): DecrementJSON {
    return {
      kind: "Decrement",
    }
  }

  toEncodable() {
    return {
      Decrement: {},
    }
  }
}

export interface InitializeJSON {
  kind: "Initialize"
}

export class Initialize {
  static readonly discriminator = 2
  static readonly kind = "Initialize"
  readonly discriminator = 2
  readonly kind = "Initialize"

  toJSON(): InitializeJSON {
    return {
      kind: "Initialize",
    }
  }

  toEncodable() {
    return {
      Initialize: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ModeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Increment" in obj) {
    return new Increment()
  }
  if ("Decrement" in obj) {
    return new Decrement()
  }
  if ("Initialize" in obj) {
    return new Initialize()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.ModeJSON): types.ModeKind {
  switch (obj.kind) {
    case "Increment": {
      return new Increment()
    }
    case "Decrement": {
      return new Decrement()
    }
    case "Initialize": {
      return new Initialize()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Increment"),
    borsh.struct([], "Decrement"),
    borsh.struct([], "Initialize"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
