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

To use Shadow Drive, you'll need to obtain credentials from GenesysGo:

### Getting Your GenesysGo Account UUID and Bearer Token

1. **Account UUID**: This is your unique account identifier provided by GenesysGo. You can obtain this by:
   - Contacting GenesysGo support
   - Checking your GenesysGo dashboard/account settings
   - It's typically provided when you set up your GenesysGo account

2. **Bearer Token**: This is your authentication token for API access. You can obtain this by:
   - Logging into your GenesysGo account
   - Navigating to API settings or developer section
   - Generating a new API token

### Using Your Credentials

Once you have your credentials, replace the placeholders in your code:

**For React applications** (see `examples/web/src/App.tsx`):
```tsx
const network = "https://us-west-1.genesysgo.net/{YOUR_ACCOUNT_UUID_HERE}";
// Replace {YOUR_ACCOUNT_UUID_HERE} with your actual UUID

<ConnectionProvider
    endpoint={network}
    config={{
        commitment: "confirmed",
        httpHeaders: {
            Authorization: "Bearer {GENESYSGO AUTHENTICATION TOKEN HERE}",
            // Replace {GENESYSGO AUTHENTICATION TOKEN HERE} with your actual token
        },
    }}
>
```

**For NodeJS applications**:
```js
const connection = new web3.Connection(
    "https://us-west-1.genesysgo.net/{YOUR_ACCOUNT_UUID_HERE}",
    {
        commitment: "confirmed",
        httpHeaders: {
            Authorization: "Bearer {YOUR_BEARER_TOKEN_HERE}",
        },
    }
);
```

> **Note**: Keep your bearer token secure and never commit it to version control. Consider using environment variables to store sensitive credentials.

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
