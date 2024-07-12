import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import fetch from "cross-fetch";

export const SHDW_DRIVE_ENDPOINT = "https://shadow-storage-dev.genesysgo.net";
export const TOKEN_MINT = new anchor.web3.PublicKey(
    "SHDWmahkzuFwa46CpG1BF3tBHUoBTfqpypWzLRL7vNX"
);
const requestShdwAirdrop = async (recipient: PublicKey) =>
    await fetch(`${SHDW_DRIVE_ENDPOINT}/devnet-shdw-airdrop`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipient: recipient.toString() }),
    });

// This generates a random keypair and funds it with SOL, SHDW
export async function getFundedUser(
    connection: anchor.web3.Connection
): Promise<[anchor.web3.Keypair, PublicKey]> {
    // Create New Pair
    let newPair = anchor.web3.Keypair.generate();
    // Airdrop SOL
    try {
        await connection.requestAirdrop(
            newPair.publicKey,
            1 * anchor.web3.LAMPORTS_PER_SOL
        );
        console.log(`Waiting for SOL Airdrop`);
        await new Promise((r) => setTimeout(r, 10000));
    } catch (e) {
        console.log(e);
    }

    // Find ATA address
    let newPairATA = await findAssociatedTokenAddress(
        newPair.publicKey,
        TOKEN_MINT
    );
    try {
        const shdwAirdrop = await requestShdwAirdrop(newPair.publicKey);
        console.log(`Waiting for SHDW Airdrop`);
        // console.log(shdwAirdrop);
        await new Promise((r) => setTimeout(r, 10000));
    } catch (e) {
        console.log(e);
    }

    return [newPair, newPairATA];
}

async function findAssociatedTokenAddress(
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
