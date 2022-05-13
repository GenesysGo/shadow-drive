# Nodejs Shadow Drive Example

## Getting Started

- From the root directory of this project:


```bash
yarn install
cd examples/node
yarn install
```

- Create a paper wallet using solana-keygen with -o specifying the outfile name.
  
- Replace the import path below with the path to your new wallet.
  ```js
  import driveUser from "some_shdw_funded_wallet";
  ```
- Fund that wallet with $SHDW and a small amount of $SOL in order to use shadow-drive commands

```bash
yarn build
yarn start
```