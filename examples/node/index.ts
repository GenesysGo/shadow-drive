import * as solanaWeb3 from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import shadowDrive from "@genesygo/shadowdrive";
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

  const drive = await new shadowDrive(connection, wallet).init();
  const storageAcc = await drive.createStorageAccount("some-test", "1MB");
  const acc = new solanaWeb3.PublicKey(storageAcc.shdw_bucket);
  const getStorageAccount = await drive.getStorageAccount(acc);
  console.log(getStorageAccount);
  const fd = new FormData();
  let fileData = fs.readFileSync("./test-files/hey.txt");
  //@ts-ignore
  fd.append("file", fileData, {
    contentType: "text/plain",
    filename: "hey",
  });
  const upload = await drive.uploadFile(acc, fd);
  console.log(upload);
})();
