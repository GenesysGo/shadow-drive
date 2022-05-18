import * as solanaWeb3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { ShdwDrive } from "@shadow-drive/sdk";
//Replace the paper wallet being used here
import driveUser from "some_shdw_funded_wallet";
import fs from "fs";
import FormData from "form-data";
(async () => {
  const connection = new solanaWeb3.Connection(
    "https://ssc-dao.genesysgo.net/"
  );
  const wallet = new anchor.Wallet(
    anchor.web3.Keypair.fromSecretKey(new Uint8Array(driveUser))
  );

  const drive = await new ShdwDrive(connection, wallet).init();
  const storageAcc = await drive.createStorageAccount("some-test", "1MB");
  const acc = new solanaWeb3.PublicKey(storageAcc.shdw_bucket);
  const retrievedAcc = await drive.getStorageAccount(acc);
  console.log(retrievedAcc);
  const fd = new FormData();
  let file = {
    name: "hey.txt",
    file: fs.readFileSync("./test-files/hey.txt"),
  };
  const upload = await drive.uploadFile(acc, file);
  console.log(upload);
})();
