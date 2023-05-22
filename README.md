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
