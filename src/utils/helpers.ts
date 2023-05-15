import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { IDL, ShadowDriveUserStaking } from "./idl";
import { SHDW_DRIVE_ENDPOINT, programAddress } from "./common";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import fetch from "node-fetch";
const DEFAULT_TIMEOUT = 3 * 60 * 1000; // 3 minutes
/**
 *
 * Todo - expand Wallet Type support
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
export async function getStorageAccountSize(
  storageAccount: string
): Promise<number> {
  const bucketData = await fetch(
    `${SHDW_DRIVE_ENDPOINT}/storage-account-size?storageAccount=${storageAccount}`
  );
  const { storage_used } = await bucketData.json();
  return storage_used;
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

  return Math.ceil(inputNumber * chunk_size);
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
export function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function getUnixTime(): number {
  return new Date().valueOf() / 1000;
}

export const awaitTransactionSignatureConfirmation = async (
  txid: anchor.web3.TransactionSignature,
  timeout: number,
  connection: anchor.web3.Connection,
  commitment: anchor.web3.Commitment = "confirmed",
  queryStatus = false
): Promise<anchor.web3.SignatureStatus | null | void> => {
  let done = false;
  let status: anchor.web3.SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  };
  let subId = 0;
  status = await new Promise(async (resolve, reject) => {
    let timer: any = setTimeout(() => {
      if (done) {
        return;
      }
      done = true;
      console.log("Rejecting for timeout...");
      reject({ timeout: true });
    }, timeout);
    try {
      console.log("COMMIMENT", commitment);
      subId = connection.onSignature(
        txid,
        (result: any, context: any) => {
          done = true;
          status = {
            err: result.err,
            slot: context.slot,
            confirmations: 0,
          };
          if (result.err) {
            console.log("Rejected via websocket", result.err);
            reject(status);
          } else {
            console.log("Resolved via websocket", result);
            resolve(status);
          }
        },
        commitment
      );
    } catch (e) {
      done = true;
      console.error("WS error in setup", txid, e);
    }
    while (!done && queryStatus) {
      // eslint-disable-next-line no-loop-func
      (async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([
            txid,
          ]);
          status = signatureStatuses && signatureStatuses.value[0];
          if (!done) {
            if (!status) {
              console.log("REST null result for", txid, status);
              if (timer === null) {
                timer = setTimeout(() => {
                  if (done) {
                    return;
                  }
                  done = true;
                  console.log("Rejecting for timeout...");
                  reject({ timeout: true });
                }, timeout);
              }
            } else if (status.err) {
              console.log("REST error for", txid, status);
              done = true;
              reject(status.err);
            } else if (!status.confirmations && !status.confirmationStatus) {
              console.log("REST no confirmations for", txid, status);
            } else {
              console.log("REST confirmation for", txid, status);
              if (timer !== null) {
                clearTimeout(timer);
                timer = null;
              }
              if (
                !status.confirmationStatus ||
                status.confirmationStatus == commitment
              ) {
                done = true;
                resolve(status);
              }
            }
          }
        } catch (e) {
          if (!done) {
            console.log("REST connection error: txid", txid, e);
          }
        }
      })();
      await sleep(2000);
    }
  });

  done = true;
  console.log("Returning status ", status);
  return status;
};
async function simulateTransaction(
  connection: anchor.web3.Connection,
  transaction: anchor.web3.Transaction,
  commitment: anchor.web3.Commitment
): Promise<
  anchor.web3.RpcResponseAndContext<anchor.web3.SimulatedTransactionResponse>
> {
  // @ts-ignore
  transaction.recentBlockhash = await connection._recentBlockhash(
    // @ts-ignore
    connection._disableBlockhashCaching
  );

  const signData = transaction.serializeMessage();
  // @ts-ignore
  const wireTransaction = transaction._serialize(signData);
  const encodedTransaction = wireTransaction.toString("base64");
  const config: any = { encoding: "base64", commitment };
  const args = [encodedTransaction, config];

  // @ts-ignore
  const res = await connection._rpcRequest("simulateTransaction", args);
  if (res.error) {
    throw new Error("failed to simulate transaction: " + res.error.message);
  }
  return res.result;
}
/*
    Original comment from Strata:
    -----------------------------------------------
    A validator has up to 120s to accept the transaction and send it into a block.
    If it doesn’t happen within that timeframe, your transaction is dropped and you’ll need 
    to send the transaction again. You can get the transaction signature and periodically 
    Ping the network for that transaction signature. If you never get anything back, 
    that means it’s definitely been dropped. If you do get a response back, you can keep pinging 
    until it’s gone to a confirmed status to move on.
  */
export async function sendAndConfirm(
  connection: anchor.web3.Connection,
  txn: Buffer,
  sendOptions: anchor.web3.SendOptions,
  commitment: anchor.web3.Commitment,
  timeout = DEFAULT_TIMEOUT
): Promise<{ txid: string }> {
  try {
    let done = false;
    let slot = 0;
    const txid = await connection.sendRawTransaction(txn, sendOptions);
    const startTime = getUnixTime();
    try {
      const confirmation = await awaitTransactionSignatureConfirmation(
        txid,
        timeout,
        connection,
        commitment,
        true
      );

      if (!confirmation)
        throw new Error("Timed out awaiting confirmation on transaction");

      if (confirmation.err) {
        const tx = await connection.getTransaction(txid);
        console.error(tx?.meta?.logMessages?.join("\n"));
        console.error(confirmation.err);
        throw new Error("Transaction failed: Custom instruction error");
      }

      slot = confirmation?.slot || 0;
    } catch (err: any) {
      console.error("Timeout Error caught", err);
      if (err.timeout) {
        throw new Error("Timed out awaiting confirmation on transaction");
      }
      let simulateResult: anchor.web3.SimulatedTransactionResponse | null =
        null;
      try {
        simulateResult = (
          await simulateTransaction(
            connection,
            anchor.web3.Transaction.from(txn),
            "single"
          )
        ).value;
      } catch (e) {}
      if (simulateResult && simulateResult.err) {
        if (simulateResult.logs) {
          console.error(simulateResult.logs.join("\n"));
        }
      }

      if (err.err) {
        throw err.err;
      }

      throw err;
    } finally {
      done = true;
    }

    console.log("Latency", txid, getUnixTime() - startTime);

    return { txid };
  } catch (e) {
    throw new Error(e);
  }
}
export function chunks(array: any, size: any) {
  return Array.apply(0, new Array(Math.ceil(array.length / size))).map(
    (_: any, index: any) => array.slice(index * size, (index + 1) * size)
  );
}

export function sortByProperty(property: any) {
  return function (a: any, b: any) {
    if (a[property].toNumber() > b[property].toNumber()) return 1;
    else if (a[property].toNumber() < b[property].toNumber()) return -1;

    return 0;
  };
}
export function getChunkLength(array1: any[], array2: any[]) {
  let starting = array1.length;
  if (array2.length) {
    return array2.reduce((total, next) => (total += next.length), starting);
  }
  return starting;
}
