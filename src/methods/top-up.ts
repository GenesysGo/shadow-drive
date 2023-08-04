import * as anchor from "@coral-xyz/anchor";
import { getStakeAccount, findAssociatedTokenAddress } from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID, createTransferInstruction } from "@solana/spl-token";
import { fromTxError } from "../types/errors";

/**
 *
 * @param {anchor.web3.PublicKey} key - Public Key of the existing storage account
 * @param {number} amount - amount of $SHDW to transfer to stake account
 * @returns {txid: string} - confirmed transaction id
 */
export default async function topUp(
  key: anchor.web3.PublicKey,
  amount: number
): Promise<{ txid: string }> {
  let stakeAccount = (await getStakeAccount(this.program, key))[0];
  const ownerAta = await findAssociatedTokenAddress(
    this.wallet.publicKey,
    tokenMint
  );
  const tx = new anchor.web3.Transaction().add(
    createTransferInstruction(
      ownerAta,
      stakeAccount,
      this.wallet.publicKey,
      new anchor.BN(amount).toNumber(),
      undefined,
      TOKEN_PROGRAM_ID
    )
  );
  try {
    let blockInfo = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockInfo.blockhash;
    tx.feePayer = this.wallet.publicKey;
    const signedTx = await this.wallet.signTransaction(tx);
    const res = await anchor.web3.sendAndConfirmRawTransaction(
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
