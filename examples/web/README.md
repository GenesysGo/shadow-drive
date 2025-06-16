# React Shadow Drive Example

## Prerequisites

Before running this example, you'll need:

1. **GenesysGo Credentials**: 
   - Account UUID
   - Bearer authentication token
   
   See the main README for instructions on obtaining these credentials.

2. **Update App.tsx**: Replace the placeholders in `src/App.tsx`:
   ```tsx
   // Line 28: Replace with your account UUID
   const network = "https://us-west-1.genesysgo.net/YOUR_ACTUAL_UUID_HERE";
   
   // Line 46: Replace with your bearer token
   Authorization: "Bearer YOUR_ACTUAL_TOKEN_HERE",
   ```

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