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
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "admin1";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "admin";
          isMut: true;
          isSigner: true;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "admin";
          isMut: true;
          isSigner: true;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "owner1";
          isMut: true;
          isSigner: true;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "owner1TokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "owner1";
          isMut: true;
          isSigner: true;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "owner1TokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
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
      name: "requestDeleteAccount";
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
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
      name: "requestDeleteAccount2";
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
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
      name: "unmarkDeleteAccount";
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
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
      name: "unmarkDeleteAccount2";
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
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
      name: "redeemRent";
      accounts: [
        {
          name: "storageAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "file";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "deleteAccount";
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "shdwPayer";
          isMut: true;
          isSigner: false;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "deleteAccount2";
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: false;
        },
        {
          name: "shdwPayer";
          isMut: true;
          isSigner: false;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "makeAccountImmutable";
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "makeAccountImmutable2";
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "badCsam";
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "uploader";
          isMut: true;
          isSigner: true;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "uploader";
          isMut: true;
          isSigner: true;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "unstakeInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "unstakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "unstakeInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "unstakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
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
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "unstakeInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "unstakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "claimStake2";
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "unstakeInfo";
          isMut: true;
          isSigner: false;
        },
        {
          name: "unstakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "crank";
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "cranker";
          isMut: true;
          isSigner: true;
        },
        {
          name: "crankerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "crank2";
      accounts: [
        {
          name: "storageConfig";
          isMut: true;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "cranker";
          isMut: true;
          isSigner: true;
        },
        {
          name: "crankerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "emissionsWallet";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "refreshStake";
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "refreshStake2";
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "ownerAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stakeAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "migrateStep1";
      accounts: [
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "migration";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
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
      accounts: [
        {
          name: "storageAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "migration";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
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
            type: "bool";
          },
          {
            name: "initCounter";
            type: "u32";
          },
          {
            name: "delCounter";
            type: "u32";
          },
          {
            name: "immutable";
            type: "bool";
          },
          {
            name: "toBeDeleted";
            type: "bool";
          },
          {
            name: "deleteRequestEpoch";
            type: "u32";
          },
          {
            name: "storage";
            type: "u64";
          },
          {
            name: "storageAvailable";
            type: "u64";
          },
          {
            name: "owner1";
            type: "publicKey";
          },
          {
            name: "owner2";
            type: "publicKey";
          },
          {
            name: "shdwPayer";
            type: "publicKey";
          },
          {
            name: "accountCounterSeed";
            type: "u32";
          },
          {
            name: "totalCostOfCurrentStorage";
            type: "u64";
          },
          {
            name: "totalFeesPaid";
            type: "u64";
          },
          {
            name: "creationTime";
            type: "u32";
          },
          {
            name: "creationEpoch";
            type: "u32";
          },
          {
            name: "lastFeeEpoch";
            type: "u32";
          },
          {
            name: "identifier";
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
            type: "bool";
          },
          {
            name: "toBeDeleted";
            type: "bool";
          },
          {
            name: "deleteRequestEpoch";
            type: "u32";
          },
          {
            name: "storage";
            type: "u64";
          },
          {
            name: "owner1";
            type: "publicKey";
          },
          {
            name: "accountCounterSeed";
            type: "u32";
          },
          {
            name: "creationTime";
            type: "u32";
          },
          {
            name: "creationEpoch";
            type: "u32";
          },
          {
            name: "lastFeeEpoch";
            type: "u32";
          },
          {
            name: "identifier";
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
            type: "u32";
          },
          {
            name: "delCounter";
            type: "u32";
          },
          {
            name: "agreedToTos";
            type: "bool";
          },
          {
            name: "lifetimeBadCsam";
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
            type: "u64";
          },
          {
            name: "storageAvailable";
            type: "u128";
          },
          {
            name: "tokenAccount";
            type: "publicKey";
          },
          {
            name: "admin2";
            type: "publicKey";
          },
          {
            name: "uploader";
            type: "publicKey";
          },
          {
            name: "mutableFeeStartEpoch";
            type: {
              option: "u32";
            };
          },
          {
            name: "shadesPerGibPerEpoch";
            type: "u64";
          },
          {
            name: "crankBps";
            type: "u16";
          },
          {
            name: "maxAccountSize";
            type: "u64";
          },
          {
            name: "minAccountSize";
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
            type: "bool";
          },
          {
            name: "toBeDeleted";
            type: "bool";
          },
          {
            name: "deleteRequestEpoch";
            type: "u32";
          },
          {
            name: "size";
            type: "u64";
          },
          {
            name: "sha256Hash";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "initCounterSeed";
            type: "u32";
          },
          {
            name: "storageAccount";
            type: "publicKey";
          },
          {
            name: "name";
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
            type: "bool";
          },
          {
            name: "toBeDeleted";
            type: "bool";
          },
          {
            name: "deleteRequestEpoch";
            type: "u32";
          },
          {
            name: "size";
            type: "u64";
          },
          {
            name: "sha256Hash";
            type: {
              array: ["u8", 32];
            };
          },
          {
            name: "initCounterSeed";
            type: "u32";
          },
          {
            name: "storageAccount";
            type: "publicKey";
          },
          {
            name: "name";
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
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "admin1",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "admin",
          isMut: true,
          isSigner: true,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "admin",
          isMut: true,
          isSigner: true,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "owner1",
          isMut: true,
          isSigner: true,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "owner1TokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "owner1",
          isMut: true,
          isSigner: true,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "owner1TokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
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
      name: "requestDeleteAccount",
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
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
      name: "requestDeleteAccount2",
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
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
      name: "unmarkDeleteAccount",
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
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
      name: "unmarkDeleteAccount2",
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
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
      name: "redeemRent",
      accounts: [
        {
          name: "storageAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "file",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "deleteAccount",
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "shdwPayer",
          isMut: true,
          isSigner: false,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "deleteAccount2",
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "shdwPayer",
          isMut: true,
          isSigner: false,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "makeAccountImmutable",
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "makeAccountImmutable2",
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "badCsam",
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "uploader",
          isMut: true,
          isSigner: true,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "uploader",
          isMut: true,
          isSigner: true,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "unstakeInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "unstakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "unstakeInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "unstakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
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
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "unstakeInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "unstakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "claimStake2",
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "unstakeInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "unstakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "crank",
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "cranker",
          isMut: true,
          isSigner: true,
        },
        {
          name: "crankerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "crank2",
      accounts: [
        {
          name: "storageConfig",
          isMut: true,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "cranker",
          isMut: true,
          isSigner: true,
        },
        {
          name: "crankerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "emissionsWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "refreshStake",
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "refreshStake2",
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "ownerAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "migrateStep1",
      accounts: [
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "migration",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
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
      accounts: [
        {
          name: "storageAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "migration",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
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
            type: "bool",
          },
          {
            name: "initCounter",
            type: "u32",
          },
          {
            name: "delCounter",
            type: "u32",
          },
          {
            name: "immutable",
            type: "bool",
          },
          {
            name: "toBeDeleted",
            type: "bool",
          },
          {
            name: "deleteRequestEpoch",
            type: "u32",
          },
          {
            name: "storage",
            type: "u64",
          },
          {
            name: "storageAvailable",
            type: "u64",
          },
          {
            name: "owner1",
            type: "publicKey",
          },
          {
            name: "owner2",
            type: "publicKey",
          },
          {
            name: "shdwPayer",
            type: "publicKey",
          },
          {
            name: "accountCounterSeed",
            type: "u32",
          },
          {
            name: "totalCostOfCurrentStorage",
            type: "u64",
          },
          {
            name: "totalFeesPaid",
            type: "u64",
          },
          {
            name: "creationTime",
            type: "u32",
          },
          {
            name: "creationEpoch",
            type: "u32",
          },
          {
            name: "lastFeeEpoch",
            type: "u32",
          },
          {
            name: "identifier",
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
            type: "bool",
          },
          {
            name: "toBeDeleted",
            type: "bool",
          },
          {
            name: "deleteRequestEpoch",
            type: "u32",
          },
          {
            name: "storage",
            type: "u64",
          },
          {
            name: "owner1",
            type: "publicKey",
          },
          {
            name: "accountCounterSeed",
            type: "u32",
          },
          {
            name: "creationTime",
            type: "u32",
          },
          {
            name: "creationEpoch",
            type: "u32",
          },
          {
            name: "lastFeeEpoch",
            type: "u32",
          },
          {
            name: "identifier",
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
            type: "u32",
          },
          {
            name: "delCounter",
            type: "u32",
          },
          {
            name: "agreedToTos",
            type: "bool",
          },
          {
            name: "lifetimeBadCsam",
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
            type: "u64",
          },
          {
            name: "storageAvailable",
            type: "u128",
          },
          {
            name: "tokenAccount",
            type: "publicKey",
          },
          {
            name: "admin2",
            type: "publicKey",
          },
          {
            name: "uploader",
            type: "publicKey",
          },
          {
            name: "mutableFeeStartEpoch",
            type: {
              option: "u32",
            },
          },
          {
            name: "shadesPerGibPerEpoch",
            type: "u64",
          },
          {
            name: "crankBps",
            type: "u16",
          },
          {
            name: "maxAccountSize",
            type: "u64",
          },
          {
            name: "minAccountSize",
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
            type: "bool",
          },
          {
            name: "toBeDeleted",
            type: "bool",
          },
          {
            name: "deleteRequestEpoch",
            type: "u32",
          },
          {
            name: "size",
            type: "u64",
          },
          {
            name: "sha256Hash",
            type: {
              array: ["u8", 32],
            },
          },
          {
            name: "initCounterSeed",
            type: "u32",
          },
          {
            name: "storageAccount",
            type: "publicKey",
          },
          {
            name: "name",
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
            type: "bool",
          },
          {
            name: "toBeDeleted",
            type: "bool",
          },
          {
            name: "deleteRequestEpoch",
            type: "u32",
          },
          {
            name: "size",
            type: "u64",
          },
          {
            name: "sha256Hash",
            type: {
              array: ["u8", 32],
            },
          },
          {
            name: "initCounterSeed",
            type: "u32",
          },
          {
            name: "storageAccount",
            type: "publicKey",
          },
          {
            name: "name",
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
