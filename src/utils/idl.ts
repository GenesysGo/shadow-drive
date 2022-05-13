export type ShadowDriveUserStaking = {
  version: "0.1.0";
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
      value: "1_000_000_000_000_000";
    },
    {
      name: "BYTES_PER_GIB";
      type: "u32";
      value: "1_073_741_824";
    },
    {
      name: "MAX_ACCOUNT_SIZE";
      type: "u64";
      value: "1_000_000_000_000";
    },
    {
      name: "MIN_ACCOUNT_SIZE";
      type: "u64";
      value: "1_000_000";
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
      name: "storeFile";
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
        },
        {
          name: "uploader";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenMint";
          isMut: true;
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
      name: "storeFiles";
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
          name: "userInfo";
          isMut: false;
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
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "file";
          isMut: true;
          isSigner: false;
        },
        {
          name: "file2";
          isMut: true;
          isSigner: false;
        },
        {
          name: "file3";
          isMut: true;
          isSigner: false;
        },
        {
          name: "file4";
          isMut: true;
          isSigner: false;
        },
        {
          name: "file5";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "filename";
          type: {
            vec: "string";
          };
        },
        {
          name: "sha256Hash";
          type: {
            vec: "string";
          };
        },
        {
          name: "size";
          type: {
            vec: "u64";
          };
        }
      ];
    },
    {
      name: "editFile";
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
          name: "file";
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
      name: "requestDeleteFile";
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
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
      name: "unmarkDeleteFile";
      accounts: [
        {
          name: "storageConfig";
          isMut: false;
          isSigner: false;
        },
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
      name: "deleteFile";
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
          name: "file";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
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
      args: [];
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
          type: {
            option: "u64";
          };
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
    }
  ];
  types: [
    {
      name: "CrankError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "StorageAccountMarkedImmutable";
          },
          {
            name: "SolanaStorageAccountNotMutable";
          }
        ];
      };
    },
    {
      name: "DecreaseStorageError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "MarkedImmutable";
          },
          {
            name: "RemovingTooMuchStorage";
          },
          {
            name: "UnsignedIntegerCastFailed";
          }
        ];
      };
    },
    {
      name: "DeleteAccountError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "StorageAccountMarkedImmutable";
          },
          {
            name: "NonzeroRemainingFileAccounts";
          },
          {
            name: "AccountStillInGracePeriod";
          },
          {
            name: "NotMarkedToBeDeleted";
          }
        ];
      };
    },
    {
      name: "DeleteFileError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "StorageAccountMarkedImmutable";
          },
          {
            name: "AccountStillInGracePeriod";
          },
          {
            name: "NotMarkedToBeDeleted";
          }
        ];
      };
    },
    {
      name: "EditFileError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "NotEnoughStorage";
          },
          {
            name: "FileNameLengthExceedsLimit";
          },
          {
            name: "FileMarkedImmutable";
          },
          {
            name: "StorageAccountMarkedImmutable";
          }
        ];
      };
    },
    {
      name: "IncreaseStorageError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "MarkedImmutable";
          },
          {
            name: "UnsignedIntegerCastFailed";
          },
          {
            name: "NoStorageIncrease";
          }
        ];
      };
    },
    {
      name: "StorageAccountError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "ExceededStorageLimit";
          },
          {
            name: "InsufficientFunds";
          },
          {
            name: "NotEnoughStorageOnShadowDrive";
          },
          {
            name: "AccountTooSmall";
          },
          {
            name: "DidNotAgreeToToS";
          },
          {
            name: "HasHadBadCsam";
          }
        ];
      };
    },
    {
      name: "MakeAccountImmutableError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "InvalidTokenTransferAmounts";
          },
          {
            name: "UnsignedIntegerCastFailed";
          },
          {
            name: "FailedToCloseAccount";
          },
          {
            name: "FailedToTransferToEmissionsWallet";
          },
          {
            name: "FailedToTransferToEmissionsWalletFromUser";
          },
          {
            name: "FailedToReturnUserFunds";
          }
        ];
      };
    },
    {
      name: "MutableFeesError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "NeedSomeFees";
          },
          {
            name: "NeedSomeCrankBps";
          }
        ];
      };
    },
    {
      name: "RefreshStakeError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "MarkedImmutable";
          },
          {
            name: "UnsignedIntegerCastFailed";
          },
          {
            name: "NoStorageIncrease";
          }
        ];
      };
    },
    {
      name: "RequestDeleteAccountError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "NotEnoughStorage";
          },
          {
            name: "FileNameLengthExceedsLimit";
          },
          {
            name: "StorageAccountMarkedImmutable";
          },
          {
            name: "AlreadyMarkedForDeletion";
          }
        ];
      };
    },
    {
      name: "RequestDeleteFileError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "NotEnoughStorage";
          },
          {
            name: "FileNameLengthExceedsLimit";
          },
          {
            name: "MarkedImmutable";
          },
          {
            name: "AlreadyMarkedForDeletion";
          }
        ];
      };
    },
    {
      name: "StoreFileError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "NotEnoughStorage";
          },
          {
            name: "FileNameLengthExceedsLimit";
          },
          {
            name: "InvalidSha256Hash";
          },
          {
            name: "InvalidCEPHHash";
          },
          {
            name: "HasHadBadCsam";
          },
          {
            name: "StorageAccountMarkedImmutable";
          }
        ];
      };
    },
    {
      name: "StoreFileError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "NotEnoughStorage";
          },
          {
            name: "FileNameLengthExceedsLimit";
          },
          {
            name: "InvalidSha256Hash";
          },
          {
            name: "InvalidCEPHHash";
          },
          {
            name: "HasHadBadCsam";
          },
          {
            name: "StorageAccountMarkedImmutable";
          }
        ];
      };
    },
    {
      name: "UnmarkDeleteAccountError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "NotEnoughStorage";
          },
          {
            name: "FileNameLengthExceedsLimit";
          },
          {
            name: "StorageAccountMarkedImmutable";
          },
          {
            name: "NotMarkedToBeDeleted";
          },
          {
            name: "EmptyStakeAccount";
          }
        ];
      };
    },
    {
      name: "UnmarkDeleteFileError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "NotEnoughStorage";
          },
          {
            name: "FileNameLengthExceedsLimit";
          },
          {
            name: "MarkedImmutable";
          },
          {
            name: "NotMarkedToBeDeleted";
          },
          {
            name: "EmptyStakeAccount";
          }
        ];
      };
    },
    {
      name: "UpdateAccountError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "MarkedImmutable";
          },
          {
            name: "IdentifierExceededMaxLength";
          }
        ];
      };
    },
    {
      name: "UpdateConfigError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "OnlyAdmin1CanChangeAdmins";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "ClaimingStakeTooSoon";
      msg: "User has not waited enough time to claim stake";
    }
  ];
};

export const IDL: ShadowDriveUserStaking = {
  version: "0.1.0",
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
      value: "1_000_000_000_000_000",
    },
    {
      name: "BYTES_PER_GIB",
      type: "u32",
      value: "1_073_741_824",
    },
    {
      name: "MAX_ACCOUNT_SIZE",
      type: "u64",
      value: "1_000_000_000_000",
    },
    {
      name: "MIN_ACCOUNT_SIZE",
      type: "u64",
      value: "1_000_000",
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
      name: "storeFile",
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
        },
        {
          name: "uploader",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenMint",
          isMut: true,
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
      name: "storeFiles",
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
          name: "userInfo",
          isMut: false,
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
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "file",
          isMut: true,
          isSigner: false,
        },
        {
          name: "file2",
          isMut: true,
          isSigner: false,
        },
        {
          name: "file3",
          isMut: true,
          isSigner: false,
        },
        {
          name: "file4",
          isMut: true,
          isSigner: false,
        },
        {
          name: "file5",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "filename",
          type: {
            vec: "string",
          },
        },
        {
          name: "sha256Hash",
          type: {
            vec: "string",
          },
        },
        {
          name: "size",
          type: {
            vec: "u64",
          },
        },
      ],
    },
    {
      name: "editFile",
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
          name: "file",
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
      name: "requestDeleteFile",
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
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
      name: "unmarkDeleteFile",
      accounts: [
        {
          name: "storageConfig",
          isMut: false,
          isSigner: false,
        },
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
      name: "deleteFile",
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
          name: "file",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
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
      args: [],
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
          type: {
            option: "u64",
          },
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
  ],
  types: [
    {
      name: "CrankError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "StorageAccountMarkedImmutable",
          },
          {
            name: "SolanaStorageAccountNotMutable",
          },
        ],
      },
    },
    {
      name: "DecreaseStorageError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "MarkedImmutable",
          },
          {
            name: "RemovingTooMuchStorage",
          },
          {
            name: "UnsignedIntegerCastFailed",
          },
        ],
      },
    },
    {
      name: "DeleteAccountError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "StorageAccountMarkedImmutable",
          },
          {
            name: "NonzeroRemainingFileAccounts",
          },
          {
            name: "AccountStillInGracePeriod",
          },
          {
            name: "NotMarkedToBeDeleted",
          },
        ],
      },
    },
    {
      name: "DeleteFileError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "StorageAccountMarkedImmutable",
          },
          {
            name: "AccountStillInGracePeriod",
          },
          {
            name: "NotMarkedToBeDeleted",
          },
        ],
      },
    },
    {
      name: "EditFileError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "NotEnoughStorage",
          },
          {
            name: "FileNameLengthExceedsLimit",
          },
          {
            name: "FileMarkedImmutable",
          },
          {
            name: "StorageAccountMarkedImmutable",
          },
        ],
      },
    },
    {
      name: "IncreaseStorageError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "MarkedImmutable",
          },
          {
            name: "UnsignedIntegerCastFailed",
          },
          {
            name: "NoStorageIncrease",
          },
        ],
      },
    },
    {
      name: "StorageAccountError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "ExceededStorageLimit",
          },
          {
            name: "InsufficientFunds",
          },
          {
            name: "NotEnoughStorageOnShadowDrive",
          },
          {
            name: "AccountTooSmall",
          },
          {
            name: "DidNotAgreeToToS",
          },
          {
            name: "HasHadBadCsam",
          },
        ],
      },
    },
    {
      name: "MakeAccountImmutableError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "InvalidTokenTransferAmounts",
          },
          {
            name: "UnsignedIntegerCastFailed",
          },
          {
            name: "FailedToCloseAccount",
          },
          {
            name: "FailedToTransferToEmissionsWallet",
          },
          {
            name: "FailedToTransferToEmissionsWalletFromUser",
          },
          {
            name: "FailedToReturnUserFunds",
          },
        ],
      },
    },
    {
      name: "MutableFeesError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "NeedSomeFees",
          },
          {
            name: "NeedSomeCrankBps",
          },
        ],
      },
    },
    {
      name: "RefreshStakeError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "MarkedImmutable",
          },
          {
            name: "UnsignedIntegerCastFailed",
          },
          {
            name: "NoStorageIncrease",
          },
        ],
      },
    },
    {
      name: "RequestDeleteAccountError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "NotEnoughStorage",
          },
          {
            name: "FileNameLengthExceedsLimit",
          },
          {
            name: "StorageAccountMarkedImmutable",
          },
          {
            name: "AlreadyMarkedForDeletion",
          },
        ],
      },
    },
    {
      name: "RequestDeleteFileError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "NotEnoughStorage",
          },
          {
            name: "FileNameLengthExceedsLimit",
          },
          {
            name: "MarkedImmutable",
          },
          {
            name: "AlreadyMarkedForDeletion",
          },
        ],
      },
    },
    {
      name: "StoreFileError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "NotEnoughStorage",
          },
          {
            name: "FileNameLengthExceedsLimit",
          },
          {
            name: "InvalidSha256Hash",
          },
          {
            name: "InvalidCEPHHash",
          },
          {
            name: "HasHadBadCsam",
          },
          {
            name: "StorageAccountMarkedImmutable",
          },
        ],
      },
    },
    {
      name: "StoreFileError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "NotEnoughStorage",
          },
          {
            name: "FileNameLengthExceedsLimit",
          },
          {
            name: "InvalidSha256Hash",
          },
          {
            name: "InvalidCEPHHash",
          },
          {
            name: "HasHadBadCsam",
          },
          {
            name: "StorageAccountMarkedImmutable",
          },
        ],
      },
    },
    {
      name: "UnmarkDeleteAccountError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "NotEnoughStorage",
          },
          {
            name: "FileNameLengthExceedsLimit",
          },
          {
            name: "StorageAccountMarkedImmutable",
          },
          {
            name: "NotMarkedToBeDeleted",
          },
          {
            name: "EmptyStakeAccount",
          },
        ],
      },
    },
    {
      name: "UnmarkDeleteFileError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "NotEnoughStorage",
          },
          {
            name: "FileNameLengthExceedsLimit",
          },
          {
            name: "MarkedImmutable",
          },
          {
            name: "NotMarkedToBeDeleted",
          },
          {
            name: "EmptyStakeAccount",
          },
        ],
      },
    },
    {
      name: "UpdateAccountError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "MarkedImmutable",
          },
          {
            name: "IdentifierExceededMaxLength",
          },
        ],
      },
    },
    {
      name: "UpdateConfigError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "OnlyAdmin1CanChangeAdmins",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "ClaimingStakeTooSoon",
      msg: "User has not waited enough time to claim stake",
    },
  ],
};
