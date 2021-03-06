import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
	GlowWalletAdapter,
	PhantomWalletAdapter,
	SlopeWalletAdapter,
	TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import React, { FC, ReactNode, useMemo } from 'react';
import Drive from './Drive';

export const App: FC = () => {
	return (
		<Context>
			<Drive></Drive>
		</Context>
	);
};

const Context: FC<{ children: ReactNode }> = ({ children }) => {
	const network = 'https://ssc-dao.genesysgo.net/';
	const wallets = useMemo(
		() => [
			new PhantomWalletAdapter(),
			new GlowWalletAdapter(),
			new SlopeWalletAdapter(),
			new TorusWalletAdapter(),
		],
		[network]
	);

	return (
		<ConnectionProvider endpoint={network} config={{ commitment: 'max' }}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};