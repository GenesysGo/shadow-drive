import { web3, BN } from "@coral-xyz/anchor";
import {
    getStakeAccount,
    findAssociatedTokenAddress,
    getSimulationUnits,
} from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID, createTransferInstruction } from "@solana/spl-token";
import { fromTxError } from "../types/errors";

/**
 *
 * @param {web3.PublicKey} key - Public Key of the existing storage account
 * @param {number} amount - amount of $SHDW to transfer to stake account
 * @returns {txid: string} - confirmed transaction id
 */
export default async function topUp(
    key: web3.PublicKey,
    amount: number,
    priorityFee: number = 100000
): Promise<{ txid: string }> {
    let stakeAccount = (await getStakeAccount(this.program, key))[0];
    const ownerAta = await findAssociatedTokenAddress(
        this.wallet.publicKey,
        tokenMint
    );
    const txn = new web3.Transaction();
    const transferInstruction = createTransferInstruction(
        ownerAta,
        stakeAccount,
        this.wallet.publicKey,
        new BN(amount).toNumber(),
        undefined,
        TOKEN_PROGRAM_ID
    );
    const computePriceIx = web3.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: Math.ceil(priorityFee),
    });

    const [units, blockHashInfo] = await Promise.all([
        getSimulationUnits(
            this.connection,
            [computePriceIx, transferInstruction],
            this.wallet.publicKey
        ),
        this.connection,
    ]);
    if (typeof units !== "undefined") {
        txn.add(web3.ComputeBudgetProgram.setComputeUnitLimit({ units }));
    }
    txn.add(computePriceIx);

    txn.add(transferInstruction);
    try {
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
