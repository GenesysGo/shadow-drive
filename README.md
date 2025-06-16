<div align="center">
  <img height="170x" src="https://github.com/GenesysGo/shadow-drive/raw/main/assets/genesysgo.jpeg" />

  <h1>Shadow Drive</h1>
   <p>
    <a href="https://genesysgo.github.io/shadow-drive/"><img alt="Docs" src="https://img.shields.io/badge/docs-typedoc-blueviolet" /></a>
	</p>
</div>

Typescript components for Shadow Drive.

## Quick Setup

### Install

Install these dependencies:

```shell
yarn add @shadow-drive/sdk
```

### Setup (React)

```tsx
import React, { useEffect } from "react";
import * as anchor from "@coral-xyz/anchor";
import { ShdwDrive } from "@shadow-drive/sdk";
import {
    AnchorWallet,
    useAnchorWallet,
    useConnection,
} from "@solana/wallet-adapter-react";

export default function Drive() {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    useEffect(() => {
        (async () => {
            if (wallet?.publicKey) {
                const drive = await new ShdwDrive(connection, wallet).init();
            }
        })();
    }, [wallet?.publicKey]);
    return <div></div>;
}
```

### Setup (NodeJS)

```js
import { ShdwDrive } from "@shadow-drive/sdk";
import * as web3 from "@solana/web3.js";
const connection = new web3.Connection("{rpc-url}", "confirmed");
const drive = await new ShdwDrive(connection, wallet).init();
```

## Authentication

Shadow Drive uses **Solana wallet signatures** for authentication. You only need a Solana wallet - no additional API keys or Shadow Drive accounts required.

### RPC Endpoint Configuration

You can use any Solana RPC endpoint. The example code shows GenesysGo's RPC service, but this is optional:

**Option 1: Public Solana RPC (No additional credentials needed)**
```js
const connection = new web3.Connection("https://api.mainnet-beta.solana.com");
```

**Option 2: GenesysGo RPC (Requires their RPC credentials)**
```js
const connection = new web3.Connection(
    "https://us-west-1.genesysgo.net/{YOUR_RPC_ACCOUNT_ID}",
    {
        commitment: "confirmed",
        httpHeaders: {
            Authorization: "Bearer {YOUR_RPC_ACCESS_TOKEN}",
        },
    }
);
```

**Option 3: Other RPC providers**
```js
// Helius, QuickNode, Alchemy, etc.
const connection = new web3.Connection("{YOUR_PREFERRED_RPC_URL}");
```

### Shadow Drive Setup

Regardless of your RPC choice, Shadow Drive setup is the same:

```js
// Your Solana wallet (browser wallet, keypair, etc.)
const wallet = /* your wallet instance */;

// Initialize Shadow Drive
const drive = await new ShdwDrive(connection, wallet).init();
```

### Understanding the Example Placeholders

In `examples/web/src/App.tsx`, the placeholders refer to **GenesysGo's RPC service credentials**:

- `{YOUR_ACCOUNT_UUID_HERE}` = Your GenesysGo RPC account identifier
- `{GENESYSGO AUTHENTICATION TOKEN HERE}` = Your GenesysGo RPC access token

**To use the example:**
1. **Option A**: Replace with your GenesysGo RPC credentials
2. **Option B**: Change to a public RPC endpoint and remove the Authorization header

### How Shadow Drive Authentication Works

1. **RPC Authentication**: Handled by your connection configuration (varies by provider)
2. **Shadow Drive Authentication**: Automatic via wallet signatures
   - No API keys needed
   - Uses cryptographic message signing
   - Wallet signs authentication messages for each operation

> **Note**: GenesysGo RPC credentials are for blockchain access only, not Shadow Drive storage. Shadow Drive authenticates through your Solana wallet automatically.

### Examples

| package                                                                   | description                                       |
| ------------------------------------------------------------------------- | ------------------------------------------------- |
| [react](https://github.com/GenesysGo/shadow-drive/tree/main/examples/web) | Using shadow-drive in a react/browser environment |

### Build From Source

1. Clone the project:

```shell
git clone https://github.com/genesysgo/shadow-drive.git
```

2. Install dependencies:

```shell
cd shadow-drive
yarn install
```
