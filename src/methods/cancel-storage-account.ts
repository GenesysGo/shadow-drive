import { web3 } from "@coral-xyz/anchor";
import { getSimulationUnits, getStakeAccount } from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { fromTxError } from "../types/errors";
import { unmarkDeleteAccount2 } from "../types/instructions";
import { StorageAccountV2 } from "../types/accounts";
/**
 *
 * @param {web3.PublicKey} key - Publickey of a Storage Account
 * @returns {{ txid: string }} - Confirmed transaction ID
 */

export default async function cancelDeleteStorageAccount(
    key: web3.PublicKey,
    priorityFee: number = 100000
): Promise<{ txid: string }> {
    let selectedAccount = await StorageAccountV2.fetch(this.connection, key);

    let stakeAccount = (await getStakeAccount(this.program, key))[0];
    let txn = new web3.Transaction();
    try {
        const unmarkDeleteAccountIx2 = unmarkDeleteAccount2({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            stakeAccount,
            owner: selectedAccount.owner1,
            tokenMint: tokenMint,
            systemProgram: web3.SystemProgram.programId,
        });
        const computePriceIx = web3.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: Math.ceil(priorityFee),
        });

        const [units, blockHashInfo] = await Promise.all([
            getSimulationUnits(
                this.connection,
                [computePriceIx, unmarkDeleteAccountIx2],
                this.wallet.publicKey
            ),
            this.connection,
        ]);
        if (typeof units !== "undefined") {
            txn.add(web3.ComputeBudgetProgram.setComputeUnitLimit({ units }));
        }
        txn.add(computePriceIx);

        txn.add(unmarkDeleteAccountIx2);
        let blockInfo = await this.connection.getLatestBlockhash();
        txn.recentBlockhash = blockInfo.blockhash;
        txn.feePayer = this.wallet.publicKey;
        const signedTx = await this.wallet.signTransaction(txn);
        const res = await web3.sendAndConfirmRawTransaction(
            this.connection,
            signedTx.serialize(),
            { skipPreflight: false, commitment: "confirmed" }
        );
        return Promise.resolve({ txid: res });
    } catch (e) {
        const parsedError = fromTxError(e);
        if (parsedError !== null) {
            return Promise.reject(new Error(parsedError.msg));
        } else {
            return Promise.reject(new Error(e.message));
        }
    }
}
