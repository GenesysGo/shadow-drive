"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const solanaWeb3 = __importStar(require("@solana/web3.js"));
const anchor = __importStar(require("@project-serum/anchor"));
const shadowdrive_1 = __importDefault(require("@genesygo/shadowdrive"));
const FRANKC3ibsaBW1o2qRuu3kspyaV4gHBuUfZ5uq9SXsqa_json_1 = __importDefault(require("../../FRANKC3ibsaBW1o2qRuu3kspyaV4gHBuUfZ5uq9SXsqa.json"));
const fs_1 = __importDefault(require("fs"));
const form_data_1 = __importDefault(require("form-data"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new solanaWeb3.Connection("http://localhost:8899");
    const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(new Uint8Array(FRANKC3ibsaBW1o2qRuu3kspyaV4gHBuUfZ5uq9SXsqa_json_1.default)));
    const drive = yield new shadowdrive_1.default(connection, wallet).init();
    //   const storageAcc = await drive.createStorageAccount("cat-test", "100MB");
    //   console.log(storageAcc);
    //   const acc = new solanaWeb3.PublicKey(storageAcc.shdw_bucket);
    const acc = new solanaWeb3.PublicKey("DniujDFJH4jJvCehyGJqGKPzjuVPeg1HCJJmACSxPDsA");
    const getStorageAccount = yield drive.getStorageAccount(acc);
    console.log(getStorageAccount);
    const fd = new form_data_1.default();
    let fileData = fs_1.default.readFileSync("./test-files/hey.txt");
    //@ts-ignore
    fd.append("file", fileData, {
        contentType: "text/plain",
        filename: "hey",
    });
    //   const upload = await drive.uploadFile(acc, fd);
    //   console.log(upload);
    //   const edit = await drive.editFile(
    //     acc,
    //     "https://shdw-drive.genesysgo.net/DniujDFJH4jJvCehyGJqGKPzjuVPeg1HCJJmACSxPDsA/hey",
    //     fd
    //   );
    //   console.log(edit);
    //   const deleted = await drive.deleteFile(
    //     acc,
    //     "https://shdw-drive.genesysgo.net/DniujDFJH4jJvCehyGJqGKPzjuVPeg1HCJJmACSxPDsA/hey"
    //   );
    //   console.log(deleted);
    //   const cancelDeleteFile = await drive.cancelDeleteFile(
    //     acc,
    //     "https://shdw-drive.genesysgo.net/DniujDFJH4jJvCehyGJqGKPzjuVPeg1HCJJmACSxPDsA/hey"
    //   );
    //   console.log(cancelDeleteFile);
    //   const cancelStorage = await drive.deleteStorageAccount(acc);
    //   console.log(cancelStorage);
    //   const cancelDeleteStorageAccount = await drive.cancelDeleteStorageAccount(
    //     acc
    //   );
    //   console.log(cancelDeleteStorageAccount);
    //   const reduceStorage = await drive.reduceStorage(acc, "1MB");
    //   console.log(reduceStorage);
    //   const makeImmutable = await drive.makeStorageImmutable(acc);
    //   console.log(makeImmutable);
    const claim = yield drive.claimStake(acc);
    console.log(claim);
}))();
