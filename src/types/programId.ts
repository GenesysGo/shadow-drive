import { web3 } from "@coral-xyz/anchor";

// Program ID passed with the cli --program-id flag when running the code generator. Do not edit, it will get overwritten.
export const PROGRAM_ID_CLI = new web3.PublicKey(
  "2e1wdyNhUvE76y6yUCvah2KaviavMJYKoRun8acMRBZZ"
);

// This constant will not get overwritten on subsequent code generations and it's safe to modify it's value.
export const PROGRAM_ID: web3.PublicKey = PROGRAM_ID_CLI;
