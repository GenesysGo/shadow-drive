import { web3 } from "@coral-xyz/anchor";
import {
    findAssociatedTokenAddress,
    getSimulationUnits,
} from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { fromTxError } from "../types/errors";
import { claimStake2 } from "../types/instructions";
import { StorageAccountV2 } from "../types/accounts";
import { PROGRAM_ID } from "../types/programId";
/**
 *
 * @param {web3.PublicKey} key - PublicKey of a Storage Account
 * @returns {{ txid: string }} - Confirmed transaction ID
 */

export default async function claimStake(
    key: web3.PublicKey,
    priorityFee: number = 100000
): Promise<{ txid: string }> {
    let selectedAccount;
    try {
        selectedAccount = await StorageAccountV2.fetch(this.connection, key);
    } catch (e) {
        return Promise.reject(new Error(e.message));
    }
    const [unstakeAccount] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("unstake-account"), key.toBytes()],
        PROGRAM_ID
    );
    const [unstakeInfo] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("unstake-info"), key.toBytes()],
        PROGRAM_ID
    );
    const ownerAta = await findAssociatedTokenAddress(
        selectedAccount.owner1,
        tokenMint
    );
    let txn = new web3.Transaction();
    try {
        const claimStakeIx2 = claimStake2({
            storageConfig: this.storageConfigPDA,
            storageAccount: key,
            unstakeInfo: unstakeInfo,
            unstakeAccount: unstakeAccount,
            owner: selectedAccount.owner1,
            ownerAta,
            tokenMint,
            systemProgram: web3.SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
        });
        const computePriceIx = web3.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: Math.ceil(priorityFee),
        });

        const [units, blockHashInfo] = await Promise.all([
            getSimulationUnits(
                this.connection,
                [computePriceIx, claimStakeIx2],
                this.wallet.publicKey
            ),
            this.connection,
        ]);
        txn.add(web3.ComputeBudgetProgram.setComputeUnitLimit({ units }));
        txn.add(computePriceIx);
        txn.add(claimStakeIx2);
        let blockInfo = await this.connection.getLatestBlockhash();
        txn.recentBlockhash = blockInfo.blockhash;
        txn.feePayer = this.wallet.publicKey;
        const signedTx = await this.wallet.signTransaction(txn);
        const res = await web3.sendAndConfirmRawTransaction(
            this.connection,
            signedTx.serialize(),
            { skipPreflight: true, commitment: "confirmed" }
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
