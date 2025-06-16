# React Shadow Drive Example

## Prerequisites

Before running this example, you'll need:

1. **Solana Wallet**: Any Solana-compatible wallet (Phantom, Solflare, etc.)

2. **RPC Endpoint Configuration**: Choose one option for `src/App.tsx`:

   **Option A: Use Public RPC** (No additional setup required)
   ```tsx
   // Line 28: Replace with public RPC
   const network = "https://api.mainnet-beta.solana.com";
   
   // Lines 42-48: Remove the httpHeaders config entirely
   <ConnectionProvider endpoint={network} config={{ commitment: "confirmed" }}>
   ```

   **Option B: Use GenesysGo RPC** (Requires GenesysGo RPC credentials)
   ```tsx
   // Line 28: Replace with your GenesysGo RPC account ID
   const network = "https://us-west-1.genesysgo.net/YOUR_RPC_ACCOUNT_ID";
   
   // Line 46: Replace with your GenesysGo RPC access token
   Authorization: "Bearer YOUR_RPC_ACCESS_TOKEN",
   ```

   > **Note**: The placeholders in App.tsx are for **RPC access**, not Shadow Drive. Shadow Drive authentication is handled automatically through your connected wallet.

## Getting Started

- From the root directory of this project:

```bash
yarn install
cd examples/web
yarn install
```

- Ensure the wallet you are testing with is funded with a small amount of $SHDW and $SOL for tx fees.

```bash
yarn start
```