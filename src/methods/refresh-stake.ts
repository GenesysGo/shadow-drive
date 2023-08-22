import { web3 } from "@coral-xyz/anchor";
import { getStakeAccount, findAssociatedTokenAddress } from "../utils/helpers";
import { tokenMint } from "../utils/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { fromTxError } from "../types/errors";
import { refreshStake2 } from "../types/instructions";
import { StorageAccountV2 } from "../types/accounts";
/**
 *
 * @param {web3.PublicKey} key - Public Key of the existing storage to increase size on
 *
 *  @returns {txid: string} - confirmed transaction id
 */
export default async function refreshStake(
  key: web3.PublicKey
): Promise<{ txid: string }> {
  let selectedAccount = await StorageAccountV2.fetch(this.connection, key);
  const stakeAccount = (await getStakeAccount(this.program, key))[0];
  const ownerAta = await findAssociatedTokenAddress(
    this.wallet.publicKey,
    tokenMint
  );
  let txn = new web3.Transaction();
  try {
    const refreshStakeIx2 = refreshStake2({
      storageConfig: this.storageConfigPDA,
      storageAccount: key,
      owner: selectedAccount.owner1,
      ownerAta: ownerAta,
      stakeAccount: stakeAccount,
      tokenMint: tokenMint,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    });
    txn.add(refreshStakeIx2);
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
      return Promise.reject(new Error(parsedError.message));
    } else {
      return Promise.reject(new Error(e.message));
    }
  }
}
