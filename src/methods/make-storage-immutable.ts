import { web3, BN } from "@coral-xyz/anchor";
import {
    getStakeAccount,
    findAssociatedTokenAddress,
    getStorageAccountSize,
    getSimulationUnits,
} from "../utils/helpers";
import {
    emissions,
    isBrowser,
    SHDW_DRIVE_ENDPOINT,
    tokenMint,
    uploader,
} from "../utils/common";
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { ShadowDriveResponse } from "../types";
import fetch from "node-fetch";
import { StorageAccountV2 } from "../types/accounts";
import { makeAccountImmutable2 } from "../types/instructions";
/**
 *
 * @param {web3.PublicKey} key - Publickey of a Storage Account
 * @returns {ShadowDriveResponse} - Confirmed transaction ID
 */
export default async function makeStorageImmutable(
    key: web3.PublicKey,
    priorityFee: number = 100000
): Promise<ShadowDriveResponse> {
    let selectedAccount = await StorageAccountV2.fetch(this.connection, key);
    try {
        const ownerAta = await findAssociatedTokenAddress(
            selectedAccount.owner1,
            tokenMint
        );
        const storageUsed = await getStorageAccountSize(key.toString());
        const emissionsAta = await findAssociatedTokenAddress(
            emissions,
            tokenMint
        );
        let stakeAccount = (await getStakeAccount(this.program, key))[0];
        let txn = new web3.Transaction();
        const makeImmutableIx2 = makeAccountImmutable2(
            { storageUsed: new BN(storageUsed) },
            {
                storageConfig: this.storageConfigPDA,
                storageAccount: key,
                stakeAccount,
                emissionsWallet: emissionsAta,
                owner: selectedAccount.owner1,
                uploader: uploader,
                ownerAta,
                tokenMint: tokenMint,
                systemProgram: web3.SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                rent: web3.SYSVAR_RENT_PUBKEY,
            }
        );

        const computePriceIx = web3.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: Math.ceil(priorityFee),
        });

        const [units, blockHashInfo] = await Promise.all([
            getSimulationUnits(
                this.connection,
                [computePriceIx, makeImmutableIx2],
                this.wallet.publicKey
            ),
            this.connection,
        ]);
        if (typeof units !== "undefined") {
            txn.add(web3.ComputeBudgetProgram.setComputeUnitLimit({ units }));
        }
        txn.add(computePriceIx);

        txn.add(makeImmutableIx2);
        txn.recentBlockhash = (
            await this.connection.getLatestBlockhash()
        ).blockhash;
        txn.feePayer = this.wallet.publicKey;
        let signedTx;
        let serializedTxn;
        if (!isBrowser) {
            await txn.partialSign(this.wallet.payer);
            serializedTxn = txn.serialize({ requireAllSignatures: false });
        } else {
            signedTx = await this.wallet.signTransaction(txn);
            serializedTxn = signedTx.serialize({ requireAllSignatures: false });
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7200000);
        const makeImmutableResponse = await fetch(
            `${SHDW_DRIVE_ENDPOINT}/make-immutable`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    transaction: Buffer.from(
                        serializedTxn.toJSON().data
                    ).toString("base64"),
                    storageUsed: storageUsed,
                }),
                signal: controller.signal,
            }
        );
        if (!makeImmutableResponse.ok) {
            return Promise.reject(
                new Error(`Server response status code: ${
                    makeImmutableResponse.status
                } \n
			Server response status message: ${(await makeImmutableResponse.json()).error}`)
            );
        }
        const responseJson = await makeImmutableResponse.json();
        return Promise.resolve(responseJson);
    } catch (e) {
        return Promise.reject(new Error(e.message));
    }
}
