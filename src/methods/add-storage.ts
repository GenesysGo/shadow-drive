import { web3, BN } from "@coral-xyz/anchor";
import {
    humanSizeToBytes,
    getStakeAccount,
    findAssociatedTokenAddress,
    getStorageAccountSize,
    getSimulationUnits,
} from "../utils/helpers";
import {
    isBrowser,
    SHDW_DRIVE_ENDPOINT,
    tokenMint,
    uploader,
    emissions,
} from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ShadowDriveResponse } from "../types";
import fetch from "node-fetch";
import {
    increaseImmutableStorage2,
    increaseStorage2,
} from "../types/instructions";
import { StorageAccountV2, UserInfo } from "../types/accounts";
/**
 *
 * @param {web3.PublicKey} key - Public Key of the existing storage to increase size on
 * @param {string} size - Amount of storage you are requesting to add to your storage account. Should be in a string like '1KB', '1MB', '1GB'. Only KB, MB, and GB storage delineations are supported currently.
 * @returns {ShadowDriveResponse} Confirmed transaction ID
 */
export default async function addStorage(
    key: web3.PublicKey,
    size: string,
    priorityFee: number = 100000
): Promise<ShadowDriveResponse> {
    let storageInputAsBytes = humanSizeToBytes(size);
    let selectedAccount = await StorageAccountV2.fetch(this.connection, key);
    if (storageInputAsBytes === false) {
        return Promise.reject(
            new Error(
                `${size} is not a valid input for size. Please use a string like '1KB', '1MB', '1GB'.`
            )
        );
    }

    let userInfoAccount = await UserInfo.fetch(this.connection, this.userInfo);

    if (userInfoAccount === null) {
        return Promise.reject(
            new Error(
                "You have not created a storage account on Shadow Drive yet. Please see the 'create-storage-account' command to get started."
            )
        );
    }
    const ownerAta = await findAssociatedTokenAddress(
        selectedAccount.owner1,
        tokenMint
    );
    let stakeAccount = (await getStakeAccount(this.program, key))[0];

    try {
        const storageUsed = await getStorageAccountSize(key.toString());
        const emissionsAta = await findAssociatedTokenAddress(
            emissions,
            tokenMint
        );
        let txn = new web3.Transaction();
        switch (selectedAccount.immutable) {
            case true:
                const increaseImmutableStorageIx = increaseImmutableStorage2(
                    {
                        additionalStorage: new BN(
                            storageInputAsBytes as number
                        ),
                    },
                    {
                        storageConfig: this.storageConfigPDA,
                        storageAccount: key,
                        owner: selectedAccount.owner1,
                        ownerAta,
                        uploader: uploader,
                        emissionsWallet: emissionsAta,
                        tokenMint: tokenMint,
                        systemProgram: web3.SystemProgram.programId,
                        tokenProgram: TOKEN_PROGRAM_ID,
                    }
                );
                const immutableComputePriceIx =
                    web3.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: Math.ceil(priorityFee),
                    });

                const [immutableUnits, immutableBlockhashInfo] =
                    await Promise.all([
                        getSimulationUnits(
                            this.connection,
                            [
                                immutableComputePriceIx,
                                increaseImmutableStorageIx,
                            ],
                            this.wallet.publicKey
                        ),
                        this.connection,
                    ]);
                if (typeof immutableUnits !== "undefined") {
                    txn.add(
                        web3.ComputeBudgetProgram.setComputeUnitLimit({
                            units: immutableUnits,
                        })
                    );
                }
                txn.add(immutableComputePriceIx);
                txn.add(increaseImmutableStorageIx);
                break;
            case false:
                const increaseStorageIx = increaseStorage2(
                    {
                        additionalStorage: new BN(
                            storageInputAsBytes as number
                        ),
                    },
                    {
                        storageConfig: this.storageConfigPDA,
                        storageAccount: key,
                        owner: selectedAccount.owner1,
                        ownerAta,
                        stakeAccount,
                        uploader: uploader,
                        tokenMint: tokenMint,
                        systemProgram: web3.SystemProgram.programId,
                        tokenProgram: TOKEN_PROGRAM_ID,
                    }
                );
                const computePriceIx =
                    web3.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: Math.ceil(priorityFee),
                    });

                const [units, blockHashInfo] = await Promise.all([
                    getSimulationUnits(
                        this.connection,
                        [computePriceIx, increaseStorageIx],
                        this.wallet.publicKey
                    ),
                    this.connection,
                ]);
                if (typeof units !== "undefined") {
                }
                txn.add(
                    web3.ComputeBudgetProgram.setComputeUnitLimit({ units })
                );
                txn.add(computePriceIx);
                txn.add(increaseStorageIx);
                break;
        }
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
        const addStorageResponse = await fetch(
            `${SHDW_DRIVE_ENDPOINT}/add-storage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    transaction: Buffer.from(
                        serializedTxn.toJSON().data
                    ).toString("base64"),
                    storage_account: key,
                    amount_to_add: storageInputAsBytes,
                    storageUsed: storageUsed,
                }),
                signal: controller.signal,
            }
        );
        if (!addStorageResponse.ok) {
            return Promise.reject(
                new Error(`Server response status code: ${
                    addStorageResponse.status
                } \n
		  Server response status message: ${(await addStorageResponse.json()).error}`)
            );
        }
        const responseJson = await addStorageResponse.json();
        return Promise.resolve(responseJson);
    } catch (e: any) {
        return Promise.reject(new Error(e.message));
    }
}
