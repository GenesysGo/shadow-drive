import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { IDL, ShadowDriveUserStaking } from "./idl";
import { programAddress } from "./common";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
/**
 *
 * Todo - support more than just anchor wallets?
 *
 * @param wallet
 * @param connection
 * @returns
 */
export function getAnchorEnvironmet(
  wallet: anchor.Wallet,
  connection: anchor.web3.Connection
): [Program<ShadowDriveUserStaking>, anchor.Provider] {
  //   const wallet = new anchor.Wallet(keypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {});
  anchor.setProvider(provider);
  const program: Program<ShadowDriveUserStaking> = new anchor.Program(
    IDL,
    programAddress
  );

  return [program, provider];
}

// This helper function finds the ATA given a wallet + mint address
export async function findAssociatedTokenAddress(
  walletAddress: anchor.web3.PublicKey,
  tokenMintAddress: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
}

export async function getStorageConfigPDA(
  program: Program<ShadowDriveUserStaking>
): Promise<[anchor.web3.PublicKey, number]> {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("storage-config")],
    program.programId
  );
}
export async function getUserInfo(
  program: Program<ShadowDriveUserStaking>,
  key: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("user-info"), key.toBytes()],
    program.programId
  );
}
export async function getStorageAccount(
  program: Program<ShadowDriveUserStaking>,
  key: anchor.web3.PublicKey,
  accountSeed: anchor.BN
): Promise<[anchor.web3.PublicKey, number]> {
  return anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("storage-account"),
      key.toBytes(),
      accountSeed.toTwos(2).toArrayLike(Buffer, "le", 4),
    ],
    program.programId
  );
}
export async function getStakeAccount(
  program: Program<ShadowDriveUserStaking>,
  storageAccount: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("stake-account"), storageAccount.toBytes()],
    program.programId
  );
}
export function humanSizeToBytes(input: string): number | boolean {
  const UNITS = ["kb", "mb", "gb"];
  let chunk_size = 0;
  let humanReadable = input.toLowerCase();
  let inputNumber = Number(humanReadable.slice(0, humanReadable.length - 2));
  let inputDescriptor = humanReadable.slice(
    humanReadable.length - 2,
    humanReadable.length
  );
  if (!UNITS.includes(inputDescriptor) || !inputNumber) {
    return false;
  }

  switch (inputDescriptor) {
    case "kb":
      chunk_size = 1_024;
      break;
    case "mb":
      chunk_size = 1_048_576;
      break;
    case "gb":
      chunk_size = 1_073_741_824;
      break;

    default:
      break;
  }

  return inputNumber * chunk_size;
}

export function bytesToHuman(bytes: any, si = false, dp = 1) {
  const thresh = si ? 1024 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}
