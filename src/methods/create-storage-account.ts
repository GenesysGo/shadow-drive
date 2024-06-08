import { web3, BN } from "@coral-xyz/anchor";
import {
    humanSizeToBytes,
    getStorageAccount,
    getStakeAccount,
    findAssociatedTokenAddress,
    getSimulationUnits,
} from "../utils/helpers";
import {
    isBrowser,
    SHDW_DRIVE_ENDPOINT,
    tokenMint,
    uploader,
} from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import fetch from "cross-fetch";
import { CreateStorageResponse } from "../types";
import { initializeAccount2 } from "../types/instructions";
import { UserInfo } from "../types/accounts";
/**
 *
 * @param {string} name - What you want your storage account to be named. (Does not have to be unique)
 * @param {string} size - Amount of storage you are requesting to create. Should be in a string like '1KB', '1MB', '1GB'. Only KB, MB, and GB storage delineations are supported currently.
 * @returns {CreateStorageResponse} Created bucket and transaction signature
 */
export default async function createStorageAccount(
    name: string,
    size: string,
    priorityFee: number = 100000
): Promise<CreateStorageResponse> {
    let storageInputAsBytes = humanSizeToBytes(size);
    if (storageInputAsBytes === false) {
        return Promise.reject(
            new Error(
                `${size} is not a valid input for size. Please use a string like '1KB', '1MB', '1GB'.`
            )
        );
    }
    // If userInfo hasn't been initialized, default to 0 for account seed
    let userInfoAccount = await UserInfo.fetch(this.connection, this.userInfo);
    let accountSeed = new BN(0);
    if (userInfoAccount !== null) {
        accountSeed = new BN(userInfoAccount.accountCounter);
    }

    let storageRequested = new BN(storageInputAsBytes.toString()); // 2^30 B <==> 1GB

    // Retreive storageAccount
    let storageAccount = (
        await getStorageAccount(
            this.program,
            this.wallet.publicKey,
            accountSeed
        )
    )[0];
    // Retrieve stakeAccount
    let stakeAccount = (await getStakeAccount(this.program, storageAccount))[0];

    let ownerAta = await findAssociatedTokenAddress(
        this.wallet.publicKey,
        tokenMint
    );
    let txn = new web3.Transaction();
    const initializeAccountIx2 = initializeAccount2(
        {
            identifier: name,
            storage: storageRequested,
        },
        {
            storageConfig: this.storageConfigPDA,
            userInfo: this.userInfo,
            storageAccount,
            stakeAccount,
            tokenMint,
            owner1: this.wallet.publicKey,
            uploader: uploader,
            owner1TokenAccount: ownerAta,
            systemProgram: web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: web3.SYSVAR_RENT_PUBKEY,
        }
    );

    const computePriceIx = web3.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: Math.ceil(priorityFee),
    });

    const [units, blockHashInfo] = await Promise.all([
        getSimulationUnits(
            this.connection,
            [computePriceIx, initializeAccountIx2],
            this.wallet.publicKey
        ),
        this.connection,
    ]);
    if (typeof units !== undefined) {
        txn.add(web3.ComputeBudgetProgram.setComputeUnitLimit({ units }));
    }
    txn.add(computePriceIx);
    txn.add(initializeAccountIx2);

    try {
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
        const createStorageResponse = await fetch(
            `${SHDW_DRIVE_ENDPOINT}/storage-account`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    transaction: Buffer.from(
                        serializedTxn.toJSON().data
                    ).toString("base64"),
                }),
                signal: controller.signal,
            }
        );
        if (!createStorageResponse.ok) {
            return Promise.reject(
                new Error(`Server response status code: ${
                    createStorageResponse.status
                } \n
		Server response status message: ${(await createStorageResponse.json()).error}`)
            );
        }
        const responseJson =
            (await createStorageResponse.json()) as CreateStorageResponse;
        return Promise.resolve(responseJson);
    } catch (e) {
        return Promise.reject(new Error(e.message));
    }
}
