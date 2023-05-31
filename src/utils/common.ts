import { web3 } from "@coral-xyz/anchor";
/**
 * Returns true if being run inside a web browser,
 * false if in a Node process
 */
export const isBrowser =
  (typeof window !== "undefined" && !window.process?.hasOwnProperty("type")) ||
  process.env.SHDW_BROWSER;

export const programAddress = new web3.PublicKey(
  "2e1wdyNhUvE76y6yUCvah2KaviavMJYKoRun8acMRBZZ"
);
export const tokenMint = new web3.PublicKey(
  "SHDWyBxihqiCj6YekG2GUr7wqKLeLAMK1gHZck9pL6y"
);
export const uploader = new web3.PublicKey(
  "972oJTFyjmVNsWM4GHEGPWUomAiJf2qrVotLtwnKmWem"
);
export const emissions = new web3.PublicKey(
  "SHDWRWMZ6kmRG9CvKFSD7kVcnUqXMtd3SaMrLvWscbj"
);
export const SHDW_DRIVE_ENDPOINT = "https://shadow-storage.genesysgo.net";
