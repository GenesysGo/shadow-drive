import React, { useEffect } from "react";
import ShdwDrive from "@shadow-drive/sdk";
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

export default function Drive() {
	const { connection } = useConnection();
	const wallet = useAnchorWallet();
	useEffect(() => {
		(async () => {
			if (wallet?.publicKey) {
				const drive = await new ShdwDrive(connection, wallet as AnchorWallet).init();
				const storage = await drive.createStorageAccount('my-test-storage', '1MB');
				const accounts = await drive.getStorageAccounts();
				console.log(accounts);
			}
		})();
	}, [wallet?.publicKey])
	return (
		<div></div>
	)
}