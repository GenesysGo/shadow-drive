import * as anchor from "@coral-xyz/anchor";
import {
  CreateStorageResponse,
  //   FileAccount,
  ShadowBatchUploadResponse,
  ShadowDriveResponse,
  ShadowFile,
  ShadowUploadResponse,
  ShadowEditResponse,
  ShdwDrive,
  StorageAccountInfo,
} from "../src";
import { getFundedUser } from "./utils";
import fs from "fs";
import path from "path";

/**
 *
 * Simple integration tests for Shadow Drive SDK
 *
 */

describe("shadow-drive v2 sdk testing", () => {
  let connection: anchor.web3.Connection,
    drive: ShdwDrive,
    balance: number,
    shdwBalance: number | null,
    user: anchor.web3.Keypair,
    userATA: anchor.web3.PublicKey,
    wallet: anchor.Wallet,
    accountKey: anchor.web3.PublicKey,
    uploadResponse: ShadowUploadResponse;
  beforeAll(async () => {
    //Must be on official devnet endpoint for SOL airdrops to work
    connection = new anchor.web3.Connection(
      "https://us-west-1.genesysgo.net/fcb96303-29df-46de-897e-04f45e044e04",
      {
        commitment: "max",
        httpHeaders: {
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBvcnRhbF9hdXRoIn0.eyJwcm94aWVzIjpbIlNWMSJdLCJ1dWlkIjoiZmNiOTYzMDMtMjlkZi00NmRlLTg5N2UtMDRmNDVlMDQ0ZTA0IiwidGllciI6MiwiaWF0IjoxNjc1OTczNTYyLCJleHAiOjE2NzYwNTk5NjJ9.GQkEj6ye7qoCb2bqg_LYINuZtXyUdx7RStzo3pnwxSdwdjwCe9XdPzAqDbSnshMETkNDpA54M6cr1Pc74s3GK_Rd7oxyyWZcD4bawxDuu7xwK68yj62E2LHLg1BKGKOeHgroVwfceKbVk5eyfHjY46PhdW5C8LspnKdmH0d2ulRM74HLFItY7i3im7H9cBeYtoYr-sRyqyuQXP5EqB9k5dN5rUpkKZchlbL2u-YNHwkc_Y2AYNtCX_cy_hcsbZp3U44BSczObSGTrlKstBpzjTMkvMmbzZPHyXFIaYBY1PombeJW6n61RUFaV6EAE_Kuc-Xy7NHeh9QKB3fJ-Q391-1WyS6Bo-2bXGpR618usccuozmkjnuSKD6urWyzsBwQdsFfoONKvrfNi0pVbEGJN9mptj7FTBiFcyoc28d1uCcK8QWGKFa_bcs88ka7ppsL4n91s6NrGAKlVbkdV3YpQ3l2S-cYHAxxqM0B2YYj0dkZkf5dAZYr0gXjo1nlZBf8_vQ51vLReqS4AqM3wO6M5p7E_pyS99Hx4fvg_CcWLjwLswt5mHGwK_IfC4MoAO8qpJvLl9wbAX4iDE7jVso9k18wfr2Glmo3fnH75sTEAAvz1QqoEs7UNIuR7iePaENZ4n_3QRo0XZ_j1HeiToMxM6zqeHNKSWl_YBHrTP-E1sc",
        },
      }
    );
  });
  it("funds a new wallet for tests", async () => {
    [user, userATA] = await getFundedUser(connection);
    console.log(`New Account: ${user.publicKey.toString()}`);
    console.log(`New Token Account: ${userATA.toString()}`);
    wallet = new anchor.Wallet(user);

    try {
      balance = await connection.getBalance(user.publicKey);
      shdwBalance = (await connection.getTokenAccountBalance(userATA)).value
        .uiAmount;
    } catch (e) {
      console.log(e);
    }
    expect(balance).toBeGreaterThanOrEqual(0.8 * anchor.web3.LAMPORTS_PER_SOL);
    expect(shdwBalance).toBeGreaterThanOrEqual(10);
  });
  it("initializes an sdk client", async () => {
    drive = await new ShdwDrive(connection, wallet).init();
    expect.objectContaining<ShdwDrive>(drive);
  });
  it("creates a shadow drive storage account", async () => {
    const res = await drive?.createStorageAccount(
      "test-account",
      "500MB",
      "v2"
    );
    accountKey = new anchor.web3.PublicKey(res.shdw_bucket);
    expect.objectContaining<CreateStorageResponse>(res);
  });
  it("add storage on a new storage account", async () => {
    const addRes = await drive.addStorage(accountKey, "10MB", "v2");
    expect.objectContaining<ShadowDriveResponse>(addRes);
  });
  it("reduce reduce storage on a new storage account", async () => {
    const reduceRes = await drive.reduceStorage(accountKey, "12MB", "v2");
    expect.objectContaining<ShadowDriveResponse>(reduceRes);
  });
  it("fails to create shadow drive storage account with invalid size", () => {
    expect(
      drive.createStorageAccount("my-failed-account", "1PB", "v2")
    ).rejects.toThrow(Error);
  });
  it("uploads a file to shadowDrive", async () => {
    let file = {
      name: "hey.txt",
      file: fs.readFileSync(path.join(__dirname, "/test-files/hey.txt")),
    };
    uploadResponse = await drive.uploadFile(accountKey, file);
    expect.objectContaining<ShadowUploadResponse>(uploadResponse);
  });
  it("edits file on shadow drive", async () => {
    let file = {
      name: "hey.txt",
      file: fs.readFileSync(path.join(__dirname, "/test-files/hey-edit.txt")),
    };
    console.log(uploadResponse.finalized_locations[0]);
    const editRes = await drive.editFile(
      accountKey,
      uploadResponse.finalized_locations[0],
      file,
      "v2"
    );
    expect.objectContaining<ShadowEditResponse>(editRes);
  });
  it("deletes file on shadow drive", async () => {
    const delRes = await drive.deleteFile(
      accountKey,
      uploadResponse.finalized_locations[0],
      "v2"
    );
    expect.objectContaining<ShadowDriveResponse>(delRes);
  });
  it("uploads multiple files to shadow drive", async () => {
    let fileArray: ShadowFile[] = [];
    fileArray.push({
      name: "1.txt",
      file: fs.readFileSync(path.join(__dirname, "/test-files/1.txt")),
    });
    fileArray.push({
      name: "2.txt",
      file: fs.readFileSync(path.join(__dirname, "/test-files/2.txt")),
    });

    const multiResponse = await drive.uploadMultipleFiles(
      accountKey,
      fileArray
    );
    expect.objectContaining<ShadowBatchUploadResponse[]>(multiResponse);
  });
  it("gets storage account infos", async () => {
    const account = await drive.getStorageAccount(accountKey);
    expect.objectContaining<StorageAccountInfo>(account);
  });
  it("deletes a shadow drive storage account", async () => {
    const delRes = await drive.deleteStorageAccount(accountKey, "v2");
    expect.objectContaining<{ txid: string }>(delRes);
  });
  it("creates a shadow drive storage account and marks immutable", async () => {
    const res = await drive?.createStorageAccount(
      "test-immutable-account",
      "100MB",
      "v2"
    );
    let newAccount = new anchor.web3.PublicKey(res.shdw_bucket);
    const immutRes = await drive.makeStorageImmutable(newAccount, "v2");
    expect.objectContaining<ShadowDriveResponse>(immutRes);
  });
  it("migrates a shadow drive v1 account to v2", async () => {
    const res = await drive?.createStorageAccount(
      "migrate-account",
      "100MB",
      "v1"
    );
    const migrateRes = await drive.migrate(
      new anchor.web3.PublicKey(res.shdw_bucket)
    );
    expect.objectContaining<{ txid: string }>(migrateRes);
  });
});
describe("shadow-drive v1 sdk testing", () => {
  let connection: anchor.web3.Connection,
    drive: ShdwDrive,
    balance: number,
    shdwBalance: number | null,
    user: anchor.web3.Keypair,
    userATA: anchor.web3.PublicKey,
    wallet: anchor.Wallet,
    accountKey: anchor.web3.PublicKey,
    uploadResponse: ShadowUploadResponse;
  beforeAll(async () => {
    //Must be on official devnet endpoint for SOL airdrops to work
    connection = new anchor.web3.Connection("http://localhost:8899/", "max");
  });
  it("funds a new wallet for tests", async () => {
    [user, userATA] = await getFundedUser(connection);
    wallet = new anchor.Wallet(user);

    try {
      balance = await connection.getBalance(user.publicKey);
      shdwBalance = (await connection.getTokenAccountBalance(userATA)).value
        .uiAmount;
    } catch (e) {
      console.log(e);
    }
    expect(balance).toBeGreaterThanOrEqual(0.8 * anchor.web3.LAMPORTS_PER_SOL);
    expect(shdwBalance).toBeGreaterThanOrEqual(10);
  });
  it("initializes an sdk client", async () => {
    drive = await new ShdwDrive(connection, wallet).init();
    expect.objectContaining<ShdwDrive>(drive);
  });
  it("creates a v1 shadow drive storage account", async () => {
    const res = await drive?.createStorageAccount(
      "test-account",
      "500MB",
      "v1"
    );
    accountKey = new anchor.web3.PublicKey(res.shdw_bucket);
    expect.objectContaining<CreateStorageResponse>(res);
  });
  it("add storage on a new v1 storage account", async () => {
    const addRes = await drive.addStorage(accountKey, "10MB", "v1");
    expect.objectContaining<ShadowDriveResponse>(addRes);
  });
  it("reduce reduce storage on a v1 storage account", async () => {
    const reduceRes = await drive.reduceStorage(accountKey, "12MB", "v1");
    expect.objectContaining<ShadowDriveResponse>(reduceRes);
  });
  it("fails to create shadow drive storage account with invalid size", () => {
    expect(
      drive.createStorageAccount("my-failed-account", "1PB", "v1")
    ).rejects.toThrow(Error);
  });
  it("uploads a file to shadowDrive", async () => {
    let file = {
      name: "hey.txt",
      file: fs.readFileSync(path.join(__dirname, "/test-files/hey.txt")),
    };
    uploadResponse = await drive.uploadFile(accountKey, file);
    expect.objectContaining<ShadowUploadResponse>(uploadResponse);
  });
  it("edits file on shadowDrive", async () => {
    let file = {
      name: "hey.txt",
      file: fs.readFileSync(path.join(__dirname, "/test-files/hey-edit.txt")),
    };
    console.log(uploadResponse.finalized_locations[0]);
    const editRes = await drive.editFile(
      accountKey,
      uploadResponse.finalized_locations[0],
      file,
      "v1"
    );
    expect.objectContaining<ShadowEditResponse>(editRes);
  });
  //   it("retrieves all file-accounts for a v1 storage account", async () => {
  //     const fileAccounts = await drive.getFileAccounts(
  //       new anchor.web3.PublicKey(accountKey),
  //       "v1"
  //     );
  //     console.log(fileAccounts);
  //     expect.objectContaining<FileAccount[]>(fileAccounts);
  //   });
  it("deletes a shadow drive storage account", async () => {
    const delRes = await drive.deleteStorageAccount(accountKey, "v1");
    expect.objectContaining<{ txid: string }>(delRes);
  });
});
