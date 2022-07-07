export type ShadowDriveUserStaking = {
  version: "1.1.1";
  name: "shadow_drive_user_staking";
  constants: [
    {
      name: "INITIAL_STORAGE_COST";
      type: "u64";
      value: "1_073_741_824";
    },
    {
      name: "MAX_IDENTIFIER_SIZE";
      type: {
        defined: "usize";
      };
      value: "64";
    },
    {
      name: "INITIAL_STORAGE_AVAILABLE";
      type: "u128";
      value: "109_951_162_777_600";
    },
    {
      name: "BYTES_PER_GIB";
      type: "u32";
      value: "1_073_741_824";
    },
    {
      name: "MAX_ACCOUNT_SIZE";
      type: "u64";
      value: "1_099_511_627_776";
    },
    {
      name: "MIN_ACCOUNT_SIZE";
      type: "u64";
      value: "1024";
    },
    {
      name: "MAX_FILENAME_SIZE";
      type: {
        defined: "usize";
      };
      value: "32";
    },
    {
      name: "SHA256_HASH_SIZE";
      type: {
        defined: "usize";
      };
      value: "256 / 8";
    },
    {
      name: "MAX_URL_SIZE";
      type: {
        defined: "usize";
      };
      value: "256";
    },
    {
      name: "DELETION_GRACE_PERIOD";
      type: "u8";
      value: "1";
    },
    {
      name: "UNSTAKE_TIME_PERIOD";
      type: "i64";
      value: "0 * 24 * 60 * 60";
    },
    {
      name: "UNSTAKE_EPOCH_PERIOD";
      type: "u64";
      value: "1";
    },
    {
      name: "INITIAL_CRANK_FEE_BPS";
      type: "u16";
      value: "100";
    }
  ];
  instructions: [
    {
      name: "initializeConfig";
      docs: [
        "Context: This is for admin use. This is to be called first, as this initializes Shadow Drive access on-chain!",
        "Function: The primary function of this is to initialize an account that stores the configuration/parameters of the storage program on-chain, e.g. admin pubkeys, storage cost."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds the SPL's staking and slashing policy.",
            "This is the account that signs transactions on behalf of the program to",
            "distribute staking rewards."
          ];
        },
        {
          name: "admin1";
          isMut: true;
          isSigner: true;
          docs: [
            "This account is the SPL's staking policy admin.",
            "Must be either freeze or mint authority"
          ];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
          docs: ["Rent Program"];
        }
      ];
      args: [
        {
          name: "uploader";
          type: "publicKey";
        },
        {
          name: "admin2";
          type: {
            option: "publicKey";
          };
        }
      ];
    },
    {
      name: "updateConfig";
      docs: [
        "Context: This is for admin use.",
        "Function: The primary function of this is update the storage_config account which stores Shadow Drive parameters on-chain, e.g. admin pubkeys, storage cost."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds storage config parameters and admin pubkeys."
          ];
        },
        {
          name: "admin";
          isMut: true;
          isSigner: true;
          docs: [
            "This account is the SPL's staking policy admin.",
            "Must be either freeze or mint authority"
          ];
        }
      ];
      args: [
        {
          name: "newStorageCost";
          type: {
            option: "u64";
          };
        },
        {
          name: "newStorageAvailable";
          type: {
            option: "u128";
          };
        },
        {
          name: "newAdmin2";
          type: {
            option: "publicKey";
          };
        },
        {
          name: "newMaxAcctSize";
          type: {
            option: "u64";
          };
        },
        {
          name: "newMinAcctSize";
          type: {
            option: "u64";
          };
        }
      ];
    },
    {
      name: "mutableFees";
      docs: [
        "Context: This is for admin use.",
        "Function: The primary function of this is to toggle fees for mutable account storage on and off."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds the SPL's staking and slashing policy.",
            "This is the account that signs transactions on behalf of the program to",
            "distribute staking rewards."
          ];
        },
        {
          name: "admin";
          isMut: true;
          isSigner: true;
          docs: [
            "This account is the SPL's staking policy admin.",
            "Must be either freeze or mint authority"
          ];
        }
      ];
      args: [
        {
          name: "shadesPerGbPerEpoch";
          type: {
            option: "u64";
          };
        },
        {
          name: "crankBps";
          type: {
            option: "u32";
          };
        }
      ];
    },
    {
      name: "initializeAccount";
      docs: [
        "Context: This is user-facing. This is to be done whenever the user decides.",
        "Function: This allows the user to initialize a storage account with some specified number of bytes."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds the storage configuration, including current cost per byte,"
          ];
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account)."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds a user's `StorageAccount` information."
          ];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["This is the token in question for staking."];
        },
        {
          name: "owner1";
          isMut: true;
          isSigner: true;
          docs: [
            "This is the user who is initializing the storage account",
            "and is automatically added as an admin"
          ];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: [
            "Uploader needs to sign as this txn",
            "needs to be fulfilled on the middleman server",
            "to create the ceph bucket"
          ];
        },
        {
          name: "owner1TokenAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the user's token account with which they are staking"
          ];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
          docs: ["Rent Program"];
        }
      ];
      args: [
        {
          name: "identifier";
          type: "string";
        },
        {
          name: "storage";
          type: "u64";
        },
        {
          name: "owner2";
          type: {
            option: "publicKey";
          };
        }
      ];
    },
    {
      name: "initializeAccount2";
      docs: [
        "Context: This is user-facing. This is to be done whenever the user decides.",
        "Function: This allows the user to initialize a storage account with some specified number of bytes."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds the storage configuration, including current cost per byte,"
          ];
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account)."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds a user's storage account information.",
            "Upgraded to `StorageAccountV2`."
          ];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["This is the token in question for staking."];
        },
        {
          name: "owner1";
          isMut: true;
          isSigner: true;
          docs: [
            "This is the user who is initializing the storage account",
            "and is automatically added as an admin"
          ];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: [
            "Uploader needs to sign as this txn",
            "needs to be fulfilled on the middleman server",
            "to create the ceph bucket"
          ];
        },
        {
          name: "owner1TokenAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the user's token account with which they are staking"
          ];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
          docs: ["Rent Program"];
        }
      ];
      args: [
        {
          name: "identifier";
          type: "string";
        },
        {
          name: "storage";
          type: "u64";
        }
      ];
    },
    {
      name: "updateAccount";
      docs: [
        "Context: This is user-facing. This is to be done whenever the user decides.",
        "Function: This allows the user to change the amount of storage they have for this storage account."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        }
      ];
      args: [
        {
          name: "identifier";
          type: {
            option: "string";
          };
        },
        {
          name: "owner2";
          type: {
            option: "publicKey";
          };
        }
      ];
    },
    {
      name: "updateAccount2";
      docs: [
        "Context: This is user-facing. This is to be done whenever the user decides.",
        "Function: This allows the user to change the amount of storage they have for this storage account."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        }
      ];
      args: [
        {
          name: "identifier";
          type: {
            option: "string";
          };
        }
      ];
    },
    {
      name: "storeFile";
      docs: [
        "Context: This is user-facing. This is to be done after our upload server verifies all is well.",
        "Function: This stores the file metadata + location on-chain."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin and uploader keys.",
            "Requires mutability to update global storage counter."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "Parent storage account, which should already be initialized.",
            "Requires mutability to update user storage account storage counter."
          ];
        },
        {
          name: "file";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner (user).",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: [
            "Uploader needs to sign to ensure all is well on storage server (incl CSAM scan)."
          ];
        },
        {
          name: "tokenMint";
          isMut: true;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        }
      ];
      args: [
        {
          name: "filename";
          type: "string";
        },
        {
          name: "sha256Hash";
          type: "string";
        },
        {
          name: "size";
          type: "u64";
        }
      ];
    },
    {
      name: "requestDeleteAccount";
      docs: [
        "Context: This is user-facing, but requires our uploader's signature. This is to be done after our upload server verifies all is well.",
        "Function: This updates the file metadata on-chain upon user edits.",
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and records the request time. Fails if parent account is marked as immutable.",
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and records the request time. Fails if account is marked as immutable."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        }
      ];
      args: [];
    },
    {
      name: "requestDeleteAccount2";
      docs: [
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and records the request time. Fails if account is marked as immutable."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        }
      ];
      args: [];
    },
    {
      name: "unmarkDeleteAccount";
      docs: [
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and resets the request time. Fails if parent account is marked as immutable.",
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and resets the request time. Fails if account is marked as immutable."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: ["Stake account associated with storage account"];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        }
      ];
      args: [];
    },
    {
      name: "unmarkDeleteAccount2";
      docs: [
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and resets the request time. Fails if account is marked as immutable."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: ["Stake account associated with storage account"];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        }
      ];
      args: [];
    },
    {
      name: "redeemRent";
      docs: [
        "Context: This is for admin use.",
        "Function: This deletes the corresponding `File` account and updates storage available in user's storage account.",
        "Fails if file is marked as immutable, or if time elapsed since request is less than the grace period.",
        "Context: This is user-facing.",
        "Function: This deletes the corresponding `File` account, allowing user to redeem SOL rent in v1.5"
      ];
      accounts: [
        {
          name: "storageAccount";
          isMut: false;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "file";
          isMut: true;
          isSigner: false;
          docs: ["File account to be closed"];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: ["File owner, user"];
        }
      ];
      args: [];
    },
    {
      name: "deleteAccount";
      docs: [
        "Context: This is for admin use.",
        "Function: This deletes the corresponding `StorageAccount` account and return's user funds.",
        "Fails if file is marked as immutable, or if time elapsed since request is less than the grace period."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account)."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: false;
          docs: [
            "File owner, user",
            "Also, our uploader keys are signing this transaction so presuamably we would only provide a good key.",
            "We also may not need this account at all."
          ];
        },
        {
          name: "shdwPayer";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the user's token account, presumably with which they staked"
          ];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: ["Admin/uploader"];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["This token accountis the SHDW operator emissions wallet"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [];
    },
    {
      name: "deleteAccount2";
      docs: [
        "Context: This is for admin use.",
        "Function: This deletes the corresponding `StorageAccount` account and return's user funds.",
        "Fails if file is marked as immutable, or if time elapsed since request is less than the grace period."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account)."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: false;
          docs: [
            "File owner, user",
            "Also, our uploader keys are signing this transaction so presuamably we would only provide a good key.",
            "We also may not need this account at all."
          ];
        },
        {
          name: "shdwPayer";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the user's token account, presumably with which they staked"
          ];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: ["Admin/uploader"];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["This token accountis the SHDW operator emissions wallet"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [];
    },
    {
      name: "makeAccountImmutable";
      docs: [
        "Context: This is user-facing.",
        "Function: This marks the corresponding `StorageAccount` account as immutable,",
        "and transfers all funds from `stake_account` to operator emissions wallet."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
            "Requires mutability to update global storage counter."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "Parent storage account.",
            "Requires mutability to update user storage account storage counter."
          ];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["This token account is the SHDW operator emissions wallet"];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: ["Uploader needs to sign off on make immutable"];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: ["User's token account"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Associated Token Program"];
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
          docs: ["Rent"];
        }
      ];
      args: [];
    },
    {
      name: "makeAccountImmutable2";
      docs: [
        "Context: This is user-facing.",
        "Function: This marks the corresponding `StorageAccount` account as immutable,",
        "and transfers all funds from `stake_account` to operator emissions wallet."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
            "Requires mutability to update global storage counter."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "Parent storage account.",
            "Requires mutability to update user storage account storage counter."
          ];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["This token account is the SHDW operator emissions wallet"];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: ["User's token account"];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: ["Uploader needs to sign off on make immutable"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Associated Token Program"];
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
          docs: ["Rent"];
        }
      ];
      args: [];
    },
    {
      name: "badCsam";
      docs: [
        "Context: This is for admin use.",
        "Function: Upon a bad csam scan, rugs user,",
        "deleting storage account and transferring funds to emissions wallet"
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account)."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "uploader";
          isMut: true;
          isSigner: true;
          docs: ["Admin/uploader"];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["This token accountis the SHDW operator emissions wallet"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [
        {
          name: "storageAvailable";
          type: "u64";
        }
      ];
    },
    {
      name: "badCsam2";
      docs: [
        "Context: This is for admin use.",
        "Function: Upon a bad csam scan, rugs user,",
        "deleting storage account and transferring funds to emissions wallet"
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account)."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "uploader";
          isMut: true;
          isSigner: true;
          docs: ["Admin/uploader"];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["This token accountis the SHDW operator emissions wallet"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [
        {
          name: "storageAvailable";
          type: "u64";
        }
      ];
    },
    {
      name: "increaseStorage";
      docs: [
        "Context: This is user facing.",
        "Function: allows user to pay for more storage at current rate."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the user's token account with which they are staking"
          ];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: ["Uploader needs to sign off on increase storage"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [
        {
          name: "additionalStorage";
          type: "u64";
        }
      ];
    },
    {
      name: "increaseStorage2";
      docs: [
        "Context: This is user facing.",
        "Function: allows user to pay for more storage at current rate."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the user's token account with which they are staking"
          ];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: ["Uploader needs to sign off on increase storage"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [
        {
          name: "additionalStorage";
          type: "u64";
        }
      ];
    },
    {
      name: "increaseImmutableStorage";
      docs: [
        "Context: This is user facing.",
        "Function: allows user to pay for more storage at current rate, after having marked an account as immutable"
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["Wallet that receives storage fees"];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the user's token account with which they are staking"
          ];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: ["Uploader needs to sign off on increase storage"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [
        {
          name: "additionalStorage";
          type: "u64";
        }
      ];
    },
    {
      name: "increaseImmutableStorage2";
      docs: [
        "Context: This is user facing.",
        "Function: allows user to pay for more storage at current rate, after having marked an account as immutable"
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["Wallet that receives storage fees"];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the user's token account with which they are staking"
          ];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: ["Uploader needs to sign off on increase storage"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [
        {
          name: "additionalStorage";
          type: "u64";
        }
      ];
    },
    {
      name: "decreaseStorage";
      docs: [
        "Context: This is user facing.",
        "Function: allows user to reduce storage, up to current available storage,",
        "and begins an unstake ticket."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "unstakeInfo";
          isMut: true;
          isSigner: false;
          docs: ["Account which stores time, epoch last unstaked"];
        },
        {
          name: "unstakeAccount";
          isMut: true;
          isSigner: false;
          docs: ["Account which stores SHDW when unstaking"];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: ["User's ATA"];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: ["Uploader needs to sign off on decrease storage"];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["Token account holding operator emission funds"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
          docs: ["Rent Program"];
        }
      ];
      args: [
        {
          name: "removeStorage";
          type: "u64";
        }
      ];
    },
    {
      name: "decreaseStorage2";
      docs: [
        "Context: This is user facing.",
        "Function: allows user to reduce storage, up to current available storage,",
        "and begins an unstake ticket."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "unstakeInfo";
          isMut: true;
          isSigner: false;
          docs: ["Account which stores time, epoch last unstaked"];
        },
        {
          name: "unstakeAccount";
          isMut: true;
          isSigner: false;
          docs: ["Account which stores SHDW when unstaking"];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: ["User's ATA"];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
          docs: ["Uploader needs to sign off on decrease storage"];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["Token account holding operator emission funds"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
          docs: ["Rent Program"];
        }
      ];
      args: [
        {
          name: "removeStorage";
          type: "u64";
        }
      ];
    },
    {
      name: "claimStake";
      docs: [
        "Context: This is user facing.",
        "Function: allows user to claim stake from unstake ticket.",
        "Fails if user has not waited an appropriate amount of time."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account. Only used here for the key"];
        },
        {
          name: "unstakeInfo";
          isMut: true;
          isSigner: false;
          docs: [
            "Account which stores time, epoch last unstaked. Close upon successful unstake."
          ];
        },
        {
          name: "unstakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "Account which stores SHDW when unstaking.  Close upon successful unstake."
          ];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Programn"];
        }
      ];
      args: [];
    },
    {
      name: "claimStake2";
      docs: [
        "Context: This is user facing.",
        "Function: allows user to claim stake from unstake ticket.",
        "Fails if user has not waited an appropriate amount of time."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account. Only used here for the key"];
        },
        {
          name: "unstakeInfo";
          isMut: true;
          isSigner: false;
          docs: [
            "Account which stores time, epoch last unstaked. Close upon successful unstake."
          ];
        },
        {
          name: "unstakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "Account which stores SHDW when unstaking.  Close upon successful unstake."
          ];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Programn"];
        }
      ];
      args: [];
    },
    {
      name: "crank";
      docs: [
        "Context: This is a public function, callable by anyone.",
        "Function: collects fees from user stake account and",
        "sends it to the operator emissions wallet."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "cranker";
          isMut: true;
          isSigner: true;
          docs: ["Cranker"];
        },
        {
          name: "crankerAta";
          isMut: true;
          isSigner: false;
          docs: ["Cranker's ATA"];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["This token accountis the SHDW operator emissions wallet"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [];
    },
    {
      name: "crank2";
      docs: [
        "Context: This is a public function, callable by anyone.",
        "Function: collects fees from user stake account and",
        "sends it to the operator emissions wallet."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "cranker";
          isMut: true;
          isSigner: true;
          docs: ["Cranker"];
        },
        {
          name: "crankerAta";
          isMut: true;
          isSigner: false;
          docs: ["Cranker's ATA"];
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
          docs: ["This token accountis the SHDW operator emissions wallet"];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [];
    },
    {
      name: "refreshStake";
      docs: [
        "Context: This is user-facing.",
        "Function: allows user to top off stake account, and unmarks deletion."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the user's token account with which they are staking"
          ];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [];
    },
    {
      name: "refreshStake2";
      docs: [
        "Context: This is user-facing.",
        "Function: allows user to top off stake account, and unmarks deletion."
      ];
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys."
          ];
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Parent storage account."];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer."
          ];
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
          docs: [
            "This is the user's token account with which they are staking"
          ];
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
          docs: [
            "This token account serves as the account which holds user's stake for file storage."
          ];
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
          docs: ["Token mint account"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
          docs: ["System Program"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
          docs: ["Token Program"];
        }
      ];
      args: [];
    },
    {
      name: "migrateStep1";
      docs: [
        "Context: This is user-facing.",
        "Function: allows user to top off stake account, and unmarks deletion."
      ];
      accounts: [
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["Account to be migrated"];
        },
        {
          name: "migration";
          isMut: true;
          isSigner: false;
          docs: ["Migration helper PDA"];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: ["User that is migrating"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "migrateStep2";
      docs: [
        "Context: This is user-facing.",
        "Function: allows user to top off stake account, and unmarks deletion."
      ];
      accounts: [
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
          docs: ["New account"];
        },
        {
          name: "migration";
          isMut: true;
          isSigner: false;
          docs: ["Migration helper PDA"];
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
          docs: ["User that is migrating"];
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "unstakeInfo";
      type: {
        kind: "struct";
        fields: [
          {
            name: "timeLastUnstaked";
            type: "i64";
          },
          {
            name: "epochLastUnstaked";
            type: "u64";
          },
          {
            name: "unstaker";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "storageAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "isStatic";
            docs: [
              "Immutable boolean to track what kind of storage account this is.",
              "NOTE: Not used in current implementation w/ non-dynamic storage payments"
            ];
            type: "bool";
          },
          {
            name: "initCounter";
            docs: [
              "Flag on whether storage account is public (usable by anyone)",
              "Counter tracking how many files have been initialized"
            ];
            type: "u32";
          },
          {
            name: "delCounter";
            docs: ["Counter tracking how many files have been deleted"];
            type: "u32";
          },
          {
            name: "immutable";
            docs: [
              "Boolean to track whether storage account (and all child File accounts) are immutable"
            ];
            type: "bool";
          },
          {
            name: "toBeDeleted";
            docs: ["Delete flag"];
            type: "bool";
          },
          {
            name: "deleteRequestEpoch";
            docs: ["Delete request epoch"];
            type: "u32";
          },
          {
            name: "storage";
            docs: ["Number of bytes of storage associated with this account"];
            type: "u64";
          },
          {
            name: "storageAvailable";
            docs: ["Bytes available for use"];
            type: "u64";
          },
          {
            name: "owner1";
            docs: ["Primary owner of StorageAccount (immutable)"];
            type: "publicKey";
          },
          {
            name: "owner2";
            docs: ["Optional owner 2"];
            type: "publicKey";
          },
          {
            name: "shdwPayer";
            docs: ["Pubkey of the token account that staked SHDW"];
            type: "publicKey";
          },
          {
            name: "accountCounterSeed";
            docs: ["Counter at time of initialization"];
            type: "u32";
          },
          {
            name: "totalCostOfCurrentStorage";
            docs: ["Total shades paid for current box size"];
            type: "u64";
          },
          {
            name: "totalFeesPaid";
            type: "u64";
          },
          {
            name: "creationTime";
            docs: ["Time of storage account creation"];
            type: "u32";
          },
          {
            name: "creationEpoch";
            docs: ["Time of storage account creation"];
            type: "u32";
          },
          {
            name: "lastFeeEpoch";
            docs: ["The last epoch through which the user paid"];
            type: "u32";
          },
          {
            name: "identifier";
            docs: [
              "Some unique identifier that the user provides.",
              "Serves as a seed for storage account PDA."
            ];
            type: "string";
          }
        ];
      };
    },
    {
      name: "storageAccountV2";
      type: {
        kind: "struct";
        fields: [
          {
            name: "immutable";
            docs: [
              "Boolean to track whether storage account (and all child File accounts) are immutable"
            ];
            type: "bool";
          },
          {
            name: "toBeDeleted";
            docs: ["Delete flag"];
            type: "bool";
          },
          {
            name: "deleteRequestEpoch";
            docs: ["Delete request epoch"];
            type: "u32";
          },
          {
            name: "storage";
            docs: ["Number of bytes of storage associated with this account"];
            type: "u64";
          },
          {
            name: "owner1";
            docs: ["Primary owner of StorageAccount (immutable)"];
            type: "publicKey";
          },
          {
            name: "accountCounterSeed";
            docs: [
              "Pubkey of the token account that staked SHDW",
              "Counter at time of initialization"
            ];
            type: "u32";
          },
          {
            name: "creationTime";
            docs: ["Time of storage account creation"];
            type: "u32";
          },
          {
            name: "creationEpoch";
            docs: ["Time of storage account creation"];
            type: "u32";
          },
          {
            name: "lastFeeEpoch";
            docs: ["The last epoch through which the user paid"];
            type: "u32";
          },
          {
            name: "identifier";
            docs: [
              "Some unique identifier that the user provides.",
              "Serves as a seed for storage account PDA."
            ];
            type: "string";
          }
        ];
      };
    },
    {
      name: "userInfo";
      type: {
        kind: "struct";
        fields: [
          {
            name: "accountCounter";
            docs: ["Total number of storage accounts the user has with us"];
            type: "u32";
          },
          {
            name: "delCounter";
            docs: ["Total number of storage accounts that have been deleted"];
            type: "u32";
          },
          {
            name: "agreedToTos";
            docs: ["Boolean denoting that the user agreed to terms of service"];
            type: "bool";
          },
          {
            name: "lifetimeBadCsam";
            docs: [
              "Boolean denoting whether this pubkey has ever had a bad scam scan"
            ];
            type: "bool";
          }
        ];
      };
    },
    {
      name: "storageConfig";
      type: {
        kind: "struct";
        fields: [
          {
            name: "shadesPerGib";
            docs: ["Storage costs in shades per GiB"];
            type: "u64";
          },
          {
            name: "storageAvailable";
            docs: ["Total storage available (or remaining)"];
            type: "u128";
          },
          {
            name: "tokenAccount";
            docs: [
              "Pubkey of SHDW token account that holds storage fees/stake"
            ];
            type: "publicKey";
          },
          {
            name: "admin2";
            docs: ["Optional Admin 2"];
            type: "publicKey";
          },
          {
            name: "uploader";
            docs: [
              "Uploader key, used to sign off on successful storage + CSAM scan"
            ];
            type: "publicKey";
          },
          {
            name: "mutableFeeStartEpoch";
            docs: ["Epoch at which mutable_account_fees turned on"];
            type: {
              option: "u32";
            };
          },
          {
            name: "shadesPerGibPerEpoch";
            docs: ["Mutable fee rate"];
            type: "u64";
          },
          {
            name: "crankBps";
            docs: ["Basis points cranker gets from cranking"];
            type: "u16";
          },
          {
            name: "maxAccountSize";
            docs: ["Maximum size of a storage account"];
            type: "u64";
          },
          {
            name: "minAccountSize";
            docs: ["Minimum size of a storage account"];
            type: "u64";
          }
        ];
      };
    },
    {
      name: "file";
      type: {
        kind: "struct";
        fields: [
          {
            name: "immutable";
            docs: ["Mutability"];
            type: "bool";
          },
          {
            name: "toBeDeleted";
            docs: ["Delete flag"];
            type: "bool";
          },
          {
            name: "deleteRequestEpoch";
            docs: ["Delete request epoch"];
            type: "u32";
          },
          {
            name: "size";
            docs: ["File size (bytes)"];
            type: "u64";
          },
          {
            name: "sha256Hash";
            docs: ["File hash (sha256)"];
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "initCounterSeed";
            docs: ["File counter seed"];
            type: "u32";
          },
          {
            name: "storageAccount";
            docs: ["Storage accout"];
            type: "publicKey";
          },
          {
            name: "name";
            docs: ["File name"];
            type: "string";
          }
        ];
      };
    },
    {
      name: "file";
      type: {
        kind: "struct";
        fields: [
          {
            name: "immutable";
            docs: ["Mutability"];
            type: "bool";
          },
          {
            name: "toBeDeleted";
            docs: ["Delete flag"];
            type: "bool";
          },
          {
            name: "deleteRequestEpoch";
            docs: ["Delete request epoch"];
            type: "u32";
          },
          {
            name: "size";
            docs: ["File size (bytes)"];
            type: "u64";
          },
          {
            name: "sha256Hash";
            docs: ["File hash (sha256)"];
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "initCounterSeed";
            docs: ["File counter seed"];
            type: "u32";
          },
          {
            name: "storageAccount";
            docs: ["Storage accout"];
            type: "publicKey";
          },
          {
            name: "name";
            docs: ["File name"];
            type: "string";
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "Mode";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Increment";
          },
          {
            name: "Decrement";
          },
          {
            name: "Initialize";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "NotEnoughStorage";
      msg: "Not enough storage available on this Storage Account";
    },
    {
      code: 6001;
      name: "FileNameLengthExceedsLimit";
      msg: "The length of the file name exceeds the limit of 32 bytes";
    },
    {
      code: 6002;
      name: "InvalidSha256Hash";
      msg: "Invalid sha256 hash";
    },
    {
      code: 6003;
      name: "HasHadBadCsam";
      msg: "User at some point had a bad csam scan";
    },
    {
      code: 6004;
      name: "StorageAccountMarkedImmutable";
      msg: "Storage account is marked as immutable";
    },
    {
      code: 6005;
      name: "ClaimingStakeTooSoon";
      msg: "User has not waited enough time to claim stake";
    },
    {
      code: 6006;
      name: "SolanaStorageAccountNotMutable";
      msg: "The storage account needs to be marked as mutable to update last fee collection epoch";
    },
    {
      code: 6007;
      name: "RemovingTooMuchStorage";
      msg: "Attempting to decrease storage by more than is available";
    },
    {
      code: 6008;
      name: "UnsignedIntegerCastFailed";
      msg: "u128 -> u64 cast failed";
    },
    {
      code: 6009;
      name: "NonzeroRemainingFileAccounts";
      msg: "This storage account still has some file accounts associated with it that have not been deleted";
    },
    {
      code: 6010;
      name: "AccountStillInGracePeriod";
      msg: "This account is still within deletion grace period";
    },
    {
      code: 6011;
      name: "AccountNotMarkedToBeDeleted";
      msg: "This account is not marked to be deleted";
    },
    {
      code: 6012;
      name: "FileStillInGracePeriod";
      msg: "This file is still within deletion grace period";
    },
    {
      code: 6013;
      name: "FileNotMarkedToBeDeleted";
      msg: "This file is not marked to be deleted";
    },
    {
      code: 6014;
      name: "FileMarkedImmutable";
      msg: "File has been marked as immutable and cannot be edited";
    },
    {
      code: 6015;
      name: "NoStorageIncrease";
      msg: "User requested an increase of zero bytes";
    },
    {
      code: 6016;
      name: "ExceededStorageLimit";
      msg: "Requested a storage account with storage over the limit";
    },
    {
      code: 6017;
      name: "InsufficientFunds";
      msg: "User does not have enough funds to store requested number of bytes.";
    },
    {
      code: 6018;
      name: "NotEnoughStorageOnShadowDrive";
      msg: "There is not available storage on Shadow Drive. Good job!";
    },
    {
      code: 6019;
      name: "AccountTooSmall";
      msg: "Requested a storage account with storage under the limit";
    },
    {
      code: 6020;
      name: "DidNotAgreeToToS";
      msg: "User did not agree to terms of service";
    },
    {
      code: 6021;
      name: "InvalidTokenTransferAmounts";
      msg: "Invalid token transfers. Stake account nonempty.";
    },
    {
      code: 6022;
      name: "FailedToCloseAccount";
      msg: "Failed to close spl token account";
    },
    {
      code: 6023;
      name: "FailedToTransferToEmissionsWallet";
      msg: "Failed to transfer to emissions wallet";
    },
    {
      code: 6024;
      name: "FailedToTransferToEmissionsWalletFromUser";
      msg: "Failed to transfer to emissions wallet from user";
    },
    {
      code: 6025;
      name: "FailedToReturnUserFunds";
      msg: "Failed to return user funds";
    },
    {
      code: 6026;
      name: "NeedSomeFees";
      msg: "Turning on fees and passing in None for storage cost per epoch";
    },
    {
      code: 6027;
      name: "NeedSomeCrankBps";
      msg: "Turning on fees and passing in None for crank bps";
    },
    {
      code: 6028;
      name: "AlreadyMarkedForDeletion";
      msg: "This account is already marked to be deleted";
    },
    {
      code: 6029;
      name: "EmptyStakeAccount";
      msg: "User has an empty stake account and must refresh stake account before unmarking account for deletion";
    },
    {
      code: 6030;
      name: "IdentifierExceededMaxLength";
      msg: "New identifier exceeds maximum length of 64 bytes";
    },
    {
      code: 6031;
      name: "OnlyAdmin1CanChangeAdmins";
      msg: "Only admin1 can change admins";
    },
    {
      code: 6032;
      name: "OnlyOneOwnerAllowedInV1_5";
      msg: "(As part of on-chain storage optimizations, only one owner is allowed in Shadow Drive v1.5)";
    }
  ];
};

export const IDL: ShadowDriveUserStaking = {
  version: "1.1.1",
  name: "shadow_drive_user_staking",
  constants: [
    {
      name: "INITIAL_STORAGE_COST",
      type: "u64",
      value: "1_073_741_824",
    },
    {
      name: "MAX_IDENTIFIER_SIZE",
      type: {
        defined: "usize",
      },
      value: "64",
    },
    {
      name: "INITIAL_STORAGE_AVAILABLE",
      type: "u128",
      value: "109_951_162_777_600",
    },
    {
      name: "BYTES_PER_GIB",
      type: "u32",
      value: "1_073_741_824",
    },
    {
      name: "MAX_ACCOUNT_SIZE",
      type: "u64",
      value: "1_099_511_627_776",
    },
    {
      name: "MIN_ACCOUNT_SIZE",
      type: "u64",
      value: "1024",
    },
    {
      name: "MAX_FILENAME_SIZE",
      type: {
        defined: "usize",
      },
      value: "32",
    },
    {
      name: "SHA256_HASH_SIZE",
      type: {
        defined: "usize",
      },
      value: "256 / 8",
    },
    {
      name: "MAX_URL_SIZE",
      type: {
        defined: "usize",
      },
      value: "256",
    },
    {
      name: "DELETION_GRACE_PERIOD",
      type: "u8",
      value: "1",
    },
    {
      name: "UNSTAKE_TIME_PERIOD",
      type: "i64",
      value: "0 * 24 * 60 * 60",
    },
    {
      name: "UNSTAKE_EPOCH_PERIOD",
      type: "u64",
      value: "1",
    },
    {
      name: "INITIAL_CRANK_FEE_BPS",
      type: "u16",
      value: "100",
    },
  ],
  instructions: [
    {
      name: "initializeConfig",
      docs: [
        "Context: This is for admin use. This is to be called first, as this initializes Shadow Drive access on-chain!",
        "Function: The primary function of this is to initialize an account that stores the configuration/parameters of the storage program on-chain, e.g. admin pubkeys, storage cost.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds the SPL's staking and slashing policy.",
            "This is the account that signs transactions on behalf of the program to",
            "distribute staking rewards.",
          ],
        },
        {
          name: "admin1",
          isMut: true,
          isSigner: true,
          docs: [
            "This account is the SPL's staking policy admin.",
            "Must be either freeze or mint authority",
          ],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
          docs: ["Rent Program"],
        },
      ],
      args: [
        {
          name: "uploader",
          type: "publicKey",
        },
        {
          name: "admin2",
          type: {
            option: "publicKey",
          },
        },
      ],
    },
    {
      name: "updateConfig",
      docs: [
        "Context: This is for admin use.",
        "Function: The primary function of this is update the storage_config account which stores Shadow Drive parameters on-chain, e.g. admin pubkeys, storage cost.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds storage config parameters and admin pubkeys.",
          ],
        },
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: [
            "This account is the SPL's staking policy admin.",
            "Must be either freeze or mint authority",
          ],
        },
      ],
      args: [
        {
          name: "newStorageCost",
          type: {
            option: "u64",
          },
        },
        {
          name: "newStorageAvailable",
          type: {
            option: "u128",
          },
        },
        {
          name: "newAdmin2",
          type: {
            option: "publicKey",
          },
        },
        {
          name: "newMaxAcctSize",
          type: {
            option: "u64",
          },
        },
        {
          name: "newMinAcctSize",
          type: {
            option: "u64",
          },
        },
      ],
    },
    {
      name: "mutableFees",
      docs: [
        "Context: This is for admin use.",
        "Function: The primary function of this is to toggle fees for mutable account storage on and off.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds the SPL's staking and slashing policy.",
            "This is the account that signs transactions on behalf of the program to",
            "distribute staking rewards.",
          ],
        },
        {
          name: "admin",
          isMut: true,
          isSigner: true,
          docs: [
            "This account is the SPL's staking policy admin.",
            "Must be either freeze or mint authority",
          ],
        },
      ],
      args: [
        {
          name: "shadesPerGbPerEpoch",
          type: {
            option: "u64",
          },
        },
        {
          name: "crankBps",
          type: {
            option: "u32",
          },
        },
      ],
    },
    {
      name: "initializeAccount",
      docs: [
        "Context: This is user-facing. This is to be done whenever the user decides.",
        "Function: This allows the user to initialize a storage account with some specified number of bytes.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds the storage configuration, including current cost per byte,",
          ],
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account).",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds a user's `StorageAccount` information.",
          ],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["This is the token in question for staking."],
        },
        {
          name: "owner1",
          isMut: true,
          isSigner: true,
          docs: [
            "This is the user who is initializing the storage account",
            "and is automatically added as an admin",
          ],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: [
            "Uploader needs to sign as this txn",
            "needs to be fulfilled on the middleman server",
            "to create the ceph bucket",
          ],
        },
        {
          name: "owner1TokenAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the user's token account with which they are staking",
          ],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
          docs: ["Rent Program"],
        },
      ],
      args: [
        {
          name: "identifier",
          type: "string",
        },
        {
          name: "storage",
          type: "u64",
        },
        {
          name: "owner2",
          type: {
            option: "publicKey",
          },
        },
      ],
    },
    {
      name: "initializeAccount2",
      docs: [
        "Context: This is user-facing. This is to be done whenever the user decides.",
        "Function: This allows the user to initialize a storage account with some specified number of bytes.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds the storage configuration, including current cost per byte,",
          ],
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account).",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds a user's storage account information.",
            "Upgraded to `StorageAccountV2`.",
          ],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["This is the token in question for staking."],
        },
        {
          name: "owner1",
          isMut: true,
          isSigner: true,
          docs: [
            "This is the user who is initializing the storage account",
            "and is automatically added as an admin",
          ],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: [
            "Uploader needs to sign as this txn",
            "needs to be fulfilled on the middleman server",
            "to create the ceph bucket",
          ],
        },
        {
          name: "owner1TokenAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the user's token account with which they are staking",
          ],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
          docs: ["Rent Program"],
        },
      ],
      args: [
        {
          name: "identifier",
          type: "string",
        },
        {
          name: "storage",
          type: "u64",
        },
      ],
    },
    {
      name: "updateAccount",
      docs: [
        "Context: This is user-facing. This is to be done whenever the user decides.",
        "Function: This allows the user to change the amount of storage they have for this storage account.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
      ],
      args: [
        {
          name: "identifier",
          type: {
            option: "string",
          },
        },
        {
          name: "owner2",
          type: {
            option: "publicKey",
          },
        },
      ],
    },
    {
      name: "updateAccount2",
      docs: [
        "Context: This is user-facing. This is to be done whenever the user decides.",
        "Function: This allows the user to change the amount of storage they have for this storage account.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
      ],
      args: [
        {
          name: "identifier",
          type: {
            option: "string",
          },
        },
      ],
    },
    {
      name: "storeFile",
      docs: [
        "Context: This is user-facing. This is to be done after our upload server verifies all is well.",
        "Function: This stores the file metadata + location on-chain.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin and uploader keys.",
            "Requires mutability to update global storage counter.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "Parent storage account, which should already be initialized.",
            "Requires mutability to update user storage account storage counter.",
          ],
        },
        {
          name: "file",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner (user).",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: [
            "Uploader needs to sign to ensure all is well on storage server (incl CSAM scan).",
          ],
        },
        {
          name: "tokenMint",
          isMut: true,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
      ],
      args: [
        {
          name: "filename",
          type: "string",
        },
        {
          name: "sha256Hash",
          type: "string",
        },
        {
          name: "size",
          type: "u64",
        },
      ],
    },
    {
      name: "requestDeleteAccount",
      docs: [
        "Context: This is user-facing, but requires our uploader's signature. This is to be done after our upload server verifies all is well.",
        "Function: This updates the file metadata on-chain upon user edits.",
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and records the request time. Fails if parent account is marked as immutable.",
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and records the request time. Fails if account is marked as immutable.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
      ],
      args: [],
    },
    {
      name: "requestDeleteAccount2",
      docs: [
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and records the request time. Fails if account is marked as immutable.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
      ],
      args: [],
    },
    {
      name: "unmarkDeleteAccount",
      docs: [
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and resets the request time. Fails if parent account is marked as immutable.",
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and resets the request time. Fails if account is marked as immutable.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: ["Stake account associated with storage account"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
      ],
      args: [],
    },
    {
      name: "unmarkDeleteAccount2",
      docs: [
        "Context: This is user-facing.",
        "Function: This updates a boolean flag and resets the request time. Fails if account is marked as immutable.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: ["Stake account associated with storage account"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
      ],
      args: [],
    },
    {
      name: "redeemRent",
      docs: [
        "Context: This is for admin use.",
        "Function: This deletes the corresponding `File` account and updates storage available in user's storage account.",
        "Fails if file is marked as immutable, or if time elapsed since request is less than the grace period.",
        "Context: This is user-facing.",
        "Function: This deletes the corresponding `File` account, allowing user to redeem SOL rent in v1.5",
      ],
      accounts: [
        {
          name: "storageAccount",
          isMut: false,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "file",
          isMut: true,
          isSigner: false,
          docs: ["File account to be closed"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: ["File owner, user"],
        },
      ],
      args: [],
    },
    {
      name: "deleteAccount",
      docs: [
        "Context: This is for admin use.",
        "Function: This deletes the corresponding `StorageAccount` account and return's user funds.",
        "Fails if file is marked as immutable, or if time elapsed since request is less than the grace period.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account).",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: false,
          docs: [
            "File owner, user",
            "Also, our uploader keys are signing this transaction so presuamably we would only provide a good key.",
            "We also may not need this account at all.",
          ],
        },
        {
          name: "shdwPayer",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the user's token account, presumably with which they staked",
          ],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: ["Admin/uploader"],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["This token accountis the SHDW operator emissions wallet"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [],
    },
    {
      name: "deleteAccount2",
      docs: [
        "Context: This is for admin use.",
        "Function: This deletes the corresponding `StorageAccount` account and return's user funds.",
        "Fails if file is marked as immutable, or if time elapsed since request is less than the grace period.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account).",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: false,
          docs: [
            "File owner, user",
            "Also, our uploader keys are signing this transaction so presuamably we would only provide a good key.",
            "We also may not need this account at all.",
          ],
        },
        {
          name: "shdwPayer",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the user's token account, presumably with which they staked",
          ],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: ["Admin/uploader"],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["This token accountis the SHDW operator emissions wallet"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [],
    },
    {
      name: "makeAccountImmutable",
      docs: [
        "Context: This is user-facing.",
        "Function: This marks the corresponding `StorageAccount` account as immutable,",
        "and transfers all funds from `stake_account` to operator emissions wallet.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
            "Requires mutability to update global storage counter.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "Parent storage account.",
            "Requires mutability to update user storage account storage counter.",
          ],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["This token account is the SHDW operator emissions wallet"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: ["Uploader needs to sign off on make immutable"],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: ["User's token account"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Associated Token Program"],
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
          docs: ["Rent"],
        },
      ],
      args: [],
    },
    {
      name: "makeAccountImmutable2",
      docs: [
        "Context: This is user-facing.",
        "Function: This marks the corresponding `StorageAccount` account as immutable,",
        "and transfers all funds from `stake_account` to operator emissions wallet.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
            "Requires mutability to update global storage counter.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "Parent storage account.",
            "Requires mutability to update user storage account storage counter.",
          ],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["This token account is the SHDW operator emissions wallet"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: ["User's token account"],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: ["Uploader needs to sign off on make immutable"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Associated Token Program"],
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
          docs: ["Rent"],
        },
      ],
      args: [],
    },
    {
      name: "badCsam",
      docs: [
        "Context: This is for admin use.",
        "Function: Upon a bad csam scan, rugs user,",
        "deleting storage account and transferring funds to emissions wallet",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account).",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "uploader",
          isMut: true,
          isSigner: true,
          docs: ["Admin/uploader"],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["This token accountis the SHDW operator emissions wallet"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [
        {
          name: "storageAvailable",
          type: "u64",
        },
      ],
    },
    {
      name: "badCsam2",
      docs: [
        "Context: This is for admin use.",
        "Function: Upon a bad csam scan, rugs user,",
        "deleting storage account and transferring funds to emissions wallet",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
          docs: [
            "This account is a PDA that holds a user's info (not specific to one storage account).",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "uploader",
          isMut: true,
          isSigner: true,
          docs: ["Admin/uploader"],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["This token accountis the SHDW operator emissions wallet"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [
        {
          name: "storageAvailable",
          type: "u64",
        },
      ],
    },
    {
      name: "increaseStorage",
      docs: [
        "Context: This is user facing.",
        "Function: allows user to pay for more storage at current rate.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the user's token account with which they are staking",
          ],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: ["Uploader needs to sign off on increase storage"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [
        {
          name: "additionalStorage",
          type: "u64",
        },
      ],
    },
    {
      name: "increaseStorage2",
      docs: [
        "Context: This is user facing.",
        "Function: allows user to pay for more storage at current rate.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the user's token account with which they are staking",
          ],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: ["Uploader needs to sign off on increase storage"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [
        {
          name: "additionalStorage",
          type: "u64",
        },
      ],
    },
    {
      name: "increaseImmutableStorage",
      docs: [
        "Context: This is user facing.",
        "Function: allows user to pay for more storage at current rate, after having marked an account as immutable",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["Wallet that receives storage fees"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the user's token account with which they are staking",
          ],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: ["Uploader needs to sign off on increase storage"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [
        {
          name: "additionalStorage",
          type: "u64",
        },
      ],
    },
    {
      name: "increaseImmutableStorage2",
      docs: [
        "Context: This is user facing.",
        "Function: allows user to pay for more storage at current rate, after having marked an account as immutable",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["Wallet that receives storage fees"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the user's token account with which they are staking",
          ],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: ["Uploader needs to sign off on increase storage"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [
        {
          name: "additionalStorage",
          type: "u64",
        },
      ],
    },
    {
      name: "decreaseStorage",
      docs: [
        "Context: This is user facing.",
        "Function: allows user to reduce storage, up to current available storage,",
        "and begins an unstake ticket.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "unstakeInfo",
          isMut: true,
          isSigner: false,
          docs: ["Account which stores time, epoch last unstaked"],
        },
        {
          name: "unstakeAccount",
          isMut: true,
          isSigner: false,
          docs: ["Account which stores SHDW when unstaking"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: ["User's ATA"],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: ["Uploader needs to sign off on decrease storage"],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["Token account holding operator emission funds"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
          docs: ["Rent Program"],
        },
      ],
      args: [
        {
          name: "removeStorage",
          type: "u64",
        },
      ],
    },
    {
      name: "decreaseStorage2",
      docs: [
        "Context: This is user facing.",
        "Function: allows user to reduce storage, up to current available storage,",
        "and begins an unstake ticket.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "unstakeInfo",
          isMut: true,
          isSigner: false,
          docs: ["Account which stores time, epoch last unstaked"],
        },
        {
          name: "unstakeAccount",
          isMut: true,
          isSigner: false,
          docs: ["Account which stores SHDW when unstaking"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: ["User's ATA"],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
          docs: ["Uploader needs to sign off on decrease storage"],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["Token account holding operator emission funds"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
          docs: ["Rent Program"],
        },
      ],
      args: [
        {
          name: "removeStorage",
          type: "u64",
        },
      ],
    },
    {
      name: "claimStake",
      docs: [
        "Context: This is user facing.",
        "Function: allows user to claim stake from unstake ticket.",
        "Fails if user has not waited an appropriate amount of time.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account. Only used here for the key"],
        },
        {
          name: "unstakeInfo",
          isMut: true,
          isSigner: false,
          docs: [
            "Account which stores time, epoch last unstaked. Close upon successful unstake.",
          ],
        },
        {
          name: "unstakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "Account which stores SHDW when unstaking.  Close upon successful unstake.",
          ],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Programn"],
        },
      ],
      args: [],
    },
    {
      name: "claimStake2",
      docs: [
        "Context: This is user facing.",
        "Function: allows user to claim stake from unstake ticket.",
        "Fails if user has not waited an appropriate amount of time.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account. Only used here for the key"],
        },
        {
          name: "unstakeInfo",
          isMut: true,
          isSigner: false,
          docs: [
            "Account which stores time, epoch last unstaked. Close upon successful unstake.",
          ],
        },
        {
          name: "unstakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "Account which stores SHDW when unstaking.  Close upon successful unstake.",
          ],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Programn"],
        },
      ],
      args: [],
    },
    {
      name: "crank",
      docs: [
        "Context: This is a public function, callable by anyone.",
        "Function: collects fees from user stake account and",
        "sends it to the operator emissions wallet.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "cranker",
          isMut: true,
          isSigner: true,
          docs: ["Cranker"],
        },
        {
          name: "crankerAta",
          isMut: true,
          isSigner: false,
          docs: ["Cranker's ATA"],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["This token accountis the SHDW operator emissions wallet"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [],
    },
    {
      name: "crank2",
      docs: [
        "Context: This is a public function, callable by anyone.",
        "Function: collects fees from user stake account and",
        "sends it to the operator emissions wallet.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "cranker",
          isMut: true,
          isSigner: true,
          docs: ["Cranker"],
        },
        {
          name: "crankerAta",
          isMut: true,
          isSigner: false,
          docs: ["Cranker's ATA"],
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
          docs: ["This token accountis the SHDW operator emissions wallet"],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [],
    },
    {
      name: "refreshStake",
      docs: [
        "Context: This is user-facing.",
        "Function: allows user to top off stake account, and unmarks deletion.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the user's token account with which they are staking",
          ],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [],
    },
    {
      name: "refreshStake2",
      docs: [
        "Context: This is user-facing.",
        "Function: allows user to top off stake account, and unmarks deletion.",
      ],
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
          docs: [
            "This is the `StorageConfig` accounts that holds all of the admin, uploader keys.",
          ],
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Parent storage account."],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: [
            "File owner, user, fee-payer",
            "Requires mutability since owner/user is fee payer.",
          ],
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
          docs: [
            "This is the user's token account with which they are staking",
          ],
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
          docs: [
            "This token account serves as the account which holds user's stake for file storage.",
          ],
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
          docs: ["Token mint account"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          docs: ["System Program"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
          docs: ["Token Program"],
        },
      ],
      args: [],
    },
    {
      name: "migrateStep1",
      docs: [
        "Context: This is user-facing.",
        "Function: allows user to top off stake account, and unmarks deletion.",
      ],
      accounts: [
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["Account to be migrated"],
        },
        {
          name: "migration",
          isMut: true,
          isSigner: false,
          docs: ["Migration helper PDA"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: ["User that is migrating"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "migrateStep2",
      docs: [
        "Context: This is user-facing.",
        "Function: allows user to top off stake account, and unmarks deletion.",
      ],
      accounts: [
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
          docs: ["New account"],
        },
        {
          name: "migration",
          isMut: true,
          isSigner: false,
          docs: ["Migration helper PDA"],
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
          docs: ["User that is migrating"],
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "unstakeInfo",
      type: {
        kind: "struct",
        fields: [
          {
            name: "timeLastUnstaked",
            type: "i64",
          },
          {
            name: "epochLastUnstaked",
            type: "u64",
          },
          {
            name: "unstaker",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "storageAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "isStatic",
            docs: [
              "Immutable boolean to track what kind of storage account this is.",
              "NOTE: Not used in current implementation w/ non-dynamic storage payments",
            ],
            type: "bool",
          },
          {
            name: "initCounter",
            docs: [
              "Flag on whether storage account is public (usable by anyone)",
              "Counter tracking how many files have been initialized",
            ],
            type: "u32",
          },
          {
            name: "delCounter",
            docs: ["Counter tracking how many files have been deleted"],
            type: "u32",
          },
          {
            name: "immutable",
            docs: [
              "Boolean to track whether storage account (and all child File accounts) are immutable",
            ],
            type: "bool",
          },
          {
            name: "toBeDeleted",
            docs: ["Delete flag"],
            type: "bool",
          },
          {
            name: "deleteRequestEpoch",
            docs: ["Delete request epoch"],
            type: "u32",
          },
          {
            name: "storage",
            docs: ["Number of bytes of storage associated with this account"],
            type: "u64",
          },
          {
            name: "storageAvailable",
            docs: ["Bytes available for use"],
            type: "u64",
          },
          {
            name: "owner1",
            docs: ["Primary owner of StorageAccount (immutable)"],
            type: "publicKey",
          },
          {
            name: "owner2",
            docs: ["Optional owner 2"],
            type: "publicKey",
          },
          {
            name: "shdwPayer",
            docs: ["Pubkey of the token account that staked SHDW"],
            type: "publicKey",
          },
          {
            name: "accountCounterSeed",
            docs: ["Counter at time of initialization"],
            type: "u32",
          },
          {
            name: "totalCostOfCurrentStorage",
            docs: ["Total shades paid for current box size"],
            type: "u64",
          },
          {
            name: "totalFeesPaid",
            type: "u64",
          },
          {
            name: "creationTime",
            docs: ["Time of storage account creation"],
            type: "u32",
          },
          {
            name: "creationEpoch",
            docs: ["Time of storage account creation"],
            type: "u32",
          },
          {
            name: "lastFeeEpoch",
            docs: ["The last epoch through which the user paid"],
            type: "u32",
          },
          {
            name: "identifier",
            docs: [
              "Some unique identifier that the user provides.",
              "Serves as a seed for storage account PDA.",
            ],
            type: "string",
          },
        ],
      },
    },
    {
      name: "storageAccountV2",
      type: {
        kind: "struct",
        fields: [
          {
            name: "immutable",
            docs: [
              "Boolean to track whether storage account (and all child File accounts) are immutable",
            ],
            type: "bool",
          },
          {
            name: "toBeDeleted",
            docs: ["Delete flag"],
            type: "bool",
          },
          {
            name: "deleteRequestEpoch",
            docs: ["Delete request epoch"],
            type: "u32",
          },
          {
            name: "storage",
            docs: ["Number of bytes of storage associated with this account"],
            type: "u64",
          },
          {
            name: "owner1",
            docs: ["Primary owner of StorageAccount (immutable)"],
            type: "publicKey",
          },
          {
            name: "accountCounterSeed",
            docs: [
              "Pubkey of the token account that staked SHDW",
              "Counter at time of initialization",
            ],
            type: "u32",
          },
          {
            name: "creationTime",
            docs: ["Time of storage account creation"],
            type: "u32",
          },
          {
            name: "creationEpoch",
            docs: ["Time of storage account creation"],
            type: "u32",
          },
          {
            name: "lastFeeEpoch",
            docs: ["The last epoch through which the user paid"],
            type: "u32",
          },
          {
            name: "identifier",
            docs: [
              "Some unique identifier that the user provides.",
              "Serves as a seed for storage account PDA.",
            ],
            type: "string",
          },
        ],
      },
    },
    {
      name: "userInfo",
      type: {
        kind: "struct",
        fields: [
          {
            name: "accountCounter",
            docs: ["Total number of storage accounts the user has with us"],
            type: "u32",
          },
          {
            name: "delCounter",
            docs: ["Total number of storage accounts that have been deleted"],
            type: "u32",
          },
          {
            name: "agreedToTos",
            docs: ["Boolean denoting that the user agreed to terms of service"],
            type: "bool",
          },
          {
            name: "lifetimeBadCsam",
            docs: [
              "Boolean denoting whether this pubkey has ever had a bad scam scan",
            ],
            type: "bool",
          },
        ],
      },
    },
    {
      name: "storageConfig",
      type: {
        kind: "struct",
        fields: [
          {
            name: "shadesPerGib",
            docs: ["Storage costs in shades per GiB"],
            type: "u64",
          },
          {
            name: "storageAvailable",
            docs: ["Total storage available (or remaining)"],
            type: "u128",
          },
          {
            name: "tokenAccount",
            docs: [
              "Pubkey of SHDW token account that holds storage fees/stake",
            ],
            type: "publicKey",
          },
          {
            name: "admin2",
            docs: ["Optional Admin 2"],
            type: "publicKey",
          },
          {
            name: "uploader",
            docs: [
              "Uploader key, used to sign off on successful storage + CSAM scan",
            ],
            type: "publicKey",
          },
          {
            name: "mutableFeeStartEpoch",
            docs: ["Epoch at which mutable_account_fees turned on"],
            type: {
              option: "u32",
            },
          },
          {
            name: "shadesPerGibPerEpoch",
            docs: ["Mutable fee rate"],
            type: "u64",
          },
          {
            name: "crankBps",
            docs: ["Basis points cranker gets from cranking"],
            type: "u16",
          },
          {
            name: "maxAccountSize",
            docs: ["Maximum size of a storage account"],
            type: "u64",
          },
          {
            name: "minAccountSize",
            docs: ["Minimum size of a storage account"],
            type: "u64",
          },
        ],
      },
    },
    {
      name: "file",
      type: {
        kind: "struct",
        fields: [
          {
            name: "immutable",
            docs: ["Mutability"],
            type: "bool",
          },
          {
            name: "toBeDeleted",
            docs: ["Delete flag"],
            type: "bool",
          },
          {
            name: "deleteRequestEpoch",
            docs: ["Delete request epoch"],
            type: "u32",
          },
          {
            name: "size",
            docs: ["File size (bytes)"],
            type: "u64",
          },
          {
            name: "sha256Hash",
            docs: ["File hash (sha256)"],
            type: {
              array: ["u8", 32],
            },
          },
          {
            name: "initCounterSeed",
            docs: ["File counter seed"],
            type: "u32",
          },
          {
            name: "storageAccount",
            docs: ["Storage accout"],
            type: "publicKey",
          },
          {
            name: "name",
            docs: ["File name"],
            type: "string",
          },
        ],
      },
    },
    {
      name: "file",
      type: {
        kind: "struct",
        fields: [
          {
            name: "immutable",
            docs: ["Mutability"],
            type: "bool",
          },
          {
            name: "toBeDeleted",
            docs: ["Delete flag"],
            type: "bool",
          },
          {
            name: "deleteRequestEpoch",
            docs: ["Delete request epoch"],
            type: "u32",
          },
          {
            name: "size",
            docs: ["File size (bytes)"],
            type: "u64",
          },
          {
            name: "sha256Hash",
            docs: ["File hash (sha256)"],
            type: {
              array: ["u8", 32],
            },
          },
          {
            name: "initCounterSeed",
            docs: ["File counter seed"],
            type: "u32",
          },
          {
            name: "storageAccount",
            docs: ["Storage accout"],
            type: "publicKey",
          },
          {
            name: "name",
            docs: ["File name"],
            type: "string",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "Mode",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Increment",
          },
          {
            name: "Decrement",
          },
          {
            name: "Initialize",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "NotEnoughStorage",
      msg: "Not enough storage available on this Storage Account",
    },
    {
      code: 6001,
      name: "FileNameLengthExceedsLimit",
      msg: "The length of the file name exceeds the limit of 32 bytes",
    },
    {
      code: 6002,
      name: "InvalidSha256Hash",
      msg: "Invalid sha256 hash",
    },
    {
      code: 6003,
      name: "HasHadBadCsam",
      msg: "User at some point had a bad csam scan",
    },
    {
      code: 6004,
      name: "StorageAccountMarkedImmutable",
      msg: "Storage account is marked as immutable",
    },
    {
      code: 6005,
      name: "ClaimingStakeTooSoon",
      msg: "User has not waited enough time to claim stake",
    },
    {
      code: 6006,
      name: "SolanaStorageAccountNotMutable",
      msg: "The storage account needs to be marked as mutable to update last fee collection epoch",
    },
    {
      code: 6007,
      name: "RemovingTooMuchStorage",
      msg: "Attempting to decrease storage by more than is available",
    },
    {
      code: 6008,
      name: "UnsignedIntegerCastFailed",
      msg: "u128 -> u64 cast failed",
    },
    {
      code: 6009,
      name: "NonzeroRemainingFileAccounts",
      msg: "This storage account still has some file accounts associated with it that have not been deleted",
    },
    {
      code: 6010,
      name: "AccountStillInGracePeriod",
      msg: "This account is still within deletion grace period",
    },
    {
      code: 6011,
      name: "AccountNotMarkedToBeDeleted",
      msg: "This account is not marked to be deleted",
    },
    {
      code: 6012,
      name: "FileStillInGracePeriod",
      msg: "This file is still within deletion grace period",
    },
    {
      code: 6013,
      name: "FileNotMarkedToBeDeleted",
      msg: "This file is not marked to be deleted",
    },
    {
      code: 6014,
      name: "FileMarkedImmutable",
      msg: "File has been marked as immutable and cannot be edited",
    },
    {
      code: 6015,
      name: "NoStorageIncrease",
      msg: "User requested an increase of zero bytes",
    },
    {
      code: 6016,
      name: "ExceededStorageLimit",
      msg: "Requested a storage account with storage over the limit",
    },
    {
      code: 6017,
      name: "InsufficientFunds",
      msg: "User does not have enough funds to store requested number of bytes.",
    },
    {
      code: 6018,
      name: "NotEnoughStorageOnShadowDrive",
      msg: "There is not available storage on Shadow Drive. Good job!",
    },
    {
      code: 6019,
      name: "AccountTooSmall",
      msg: "Requested a storage account with storage under the limit",
    },
    {
      code: 6020,
      name: "DidNotAgreeToToS",
      msg: "User did not agree to terms of service",
    },
    {
      code: 6021,
      name: "InvalidTokenTransferAmounts",
      msg: "Invalid token transfers. Stake account nonempty.",
    },
    {
      code: 6022,
      name: "FailedToCloseAccount",
      msg: "Failed to close spl token account",
    },
    {
      code: 6023,
      name: "FailedToTransferToEmissionsWallet",
      msg: "Failed to transfer to emissions wallet",
    },
    {
      code: 6024,
      name: "FailedToTransferToEmissionsWalletFromUser",
      msg: "Failed to transfer to emissions wallet from user",
    },
    {
      code: 6025,
      name: "FailedToReturnUserFunds",
      msg: "Failed to return user funds",
    },
    {
      code: 6026,
      name: "NeedSomeFees",
      msg: "Turning on fees and passing in None for storage cost per epoch",
    },
    {
      code: 6027,
      name: "NeedSomeCrankBps",
      msg: "Turning on fees and passing in None for crank bps",
    },
    {
      code: 6028,
      name: "AlreadyMarkedForDeletion",
      msg: "This account is already marked to be deleted",
    },
    {
      code: 6029,
      name: "EmptyStakeAccount",
      msg: "User has an empty stake account and must refresh stake account before unmarking account for deletion",
    },
    {
      code: 6030,
      name: "IdentifierExceededMaxLength",
      msg: "New identifier exceeds maximum length of 64 bytes",
    },
    {
      code: 6031,
      name: "OnlyAdmin1CanChangeAdmins",
      msg: "Only admin1 can change admins",
    },
    {
      code: 6032,
      name: "OnlyOneOwnerAllowedInV1_5",
      msg: "(As part of on-chain storage optimizations, only one owner is allowed in Shadow Drive v1.5)",
    },
  ],
};
