import * as anchor from "@project-serum/anchor";
import {
  getStakeAccount,
  findAssociatedTokenAddress,
  sendAndConfirm,
} from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID, createTransferInstruction } from "@solana/spl-token";

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
  const stakeAccountAta = await findAssociatedTokenAddress(
    stakeAccount,
    tokenMint
  );
  const tx = new anchor.web3.Transaction().add(
    createTransferInstruction(
      ownerAta,
      stakeAccountAta,
      this.wallet.publicKey,
      new anchor.BN(amount).toNumber(),
      undefined,
      TOKEN_PROGRAM_ID
    )
  );
  try {
    tx.recentBlockhash = (
      await this.connection.getLatestBlockhash("max")
    ).blockhash;
    tx.feePayer = this.wallet.publicKey;
    let signedTx = await this.wallet.signTransaction(tx);
    let txid;
    txid = await sendAndConfirm(
      this.connection,
      signedTx.serialize(),
      { skipPreflight: false },
      "max"
    );
    return Promise.resolve(txid);
  } catch (e) {
    return Promise.reject(new Error(e));
  }
}
