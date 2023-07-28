export type CustomError =
  | NotEnoughStorage
  | FileNameLengthExceedsLimit
  | InvalidSha256Hash
  | HasHadBadCsam
  | StorageAccountMarkedImmutable
  | ClaimingStakeTooSoon
  | SolanaStorageAccountNotMutable
  | RemovingTooMuchStorage
  | UnsignedIntegerCastFailed
  | NonzeroRemainingFileAccounts
  | AccountStillInGracePeriod
  | AccountNotMarkedToBeDeleted
  | FileStillInGracePeriod
  | FileNotMarkedToBeDeleted
  | FileMarkedImmutable
  | NoStorageIncrease
  | ExceededStorageLimit
  | InsufficientFunds
  | NotEnoughStorageOnShadowDrive
  | AccountTooSmall
  | DidNotAgreeToToS
  | InvalidTokenTransferAmounts
  | FailedToCloseAccount
  | FailedToTransferToEmissionsWallet
  | FailedToTransferToEmissionsWalletFromUser
  | FailedToReturnUserFunds
  | NeedSomeFees
  | NeedSomeCrankBps
  | AlreadyMarkedForDeletion
  | EmptyStakeAccount
  | IdentifierExceededMaxLength
  | OnlyAdmin1CanChangeAdmins
  | OnlyOneOwnerAllowedInV1_5

export class NotEnoughStorage extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "NotEnoughStorage"
  readonly msg = "Not enough storage available on this Storage Account"

  constructor(readonly logs?: string[]) {
    super("6000: Not enough storage available on this Storage Account")
  }
}

export class FileNameLengthExceedsLimit extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "FileNameLengthExceedsLimit"
  readonly msg = "The length of the file name exceeds the limit of 32 bytes"

  constructor(readonly logs?: string[]) {
    super("6001: The length of the file name exceeds the limit of 32 bytes")
  }
}

export class InvalidSha256Hash extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "InvalidSha256Hash"
  readonly msg = "Invalid sha256 hash"

  constructor(readonly logs?: string[]) {
    super("6002: Invalid sha256 hash")
  }
}

export class HasHadBadCsam extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "HasHadBadCsam"
  readonly msg = "User at some point had a bad csam scan"

  constructor(readonly logs?: string[]) {
    super("6003: User at some point had a bad csam scan")
  }
}

export class StorageAccountMarkedImmutable extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "StorageAccountMarkedImmutable"
  readonly msg = "Storage account is marked as immutable"

  constructor(readonly logs?: string[]) {
    super("6004: Storage account is marked as immutable")
  }
}

export class ClaimingStakeTooSoon extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "ClaimingStakeTooSoon"
  readonly msg = "User has not waited enough time to claim stake"

  constructor(readonly logs?: string[]) {
    super("6005: User has not waited enough time to claim stake")
  }
}

export class SolanaStorageAccountNotMutable extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "SolanaStorageAccountNotMutable"
  readonly msg =
    "The storage account needs to be marked as mutable to update last fee collection epoch"

  constructor(readonly logs?: string[]) {
    super(
      "6006: The storage account needs to be marked as mutable to update last fee collection epoch"
    )
  }
}

export class RemovingTooMuchStorage extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "RemovingTooMuchStorage"
  readonly msg = "Attempting to decrease storage by more than is available"

  constructor(readonly logs?: string[]) {
    super("6007: Attempting to decrease storage by more than is available")
  }
}

export class UnsignedIntegerCastFailed extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "UnsignedIntegerCastFailed"
  readonly msg = "u128 -> u64 cast failed"

  constructor(readonly logs?: string[]) {
    super("6008: u128 -> u64 cast failed")
  }
}

export class NonzeroRemainingFileAccounts extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "NonzeroRemainingFileAccounts"
  readonly msg =
    "This storage account still has some file accounts associated with it that have not been deleted"

  constructor(readonly logs?: string[]) {
    super(
      "6009: This storage account still has some file accounts associated with it that have not been deleted"
    )
  }
}

export class AccountStillInGracePeriod extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "AccountStillInGracePeriod"
  readonly msg = "This account is still within deletion grace period"

  constructor(readonly logs?: string[]) {
    super("6010: This account is still within deletion grace period")
  }
}

export class AccountNotMarkedToBeDeleted extends Error {
  static readonly code = 6011
  readonly code = 6011
  readonly name = "AccountNotMarkedToBeDeleted"
  readonly msg = "This account is not marked to be deleted"

  constructor(readonly logs?: string[]) {
    super("6011: This account is not marked to be deleted")
  }
}

export class FileStillInGracePeriod extends Error {
  static readonly code = 6012
  readonly code = 6012
  readonly name = "FileStillInGracePeriod"
  readonly msg = "This file is still within deletion grace period"

  constructor(readonly logs?: string[]) {
    super("6012: This file is still within deletion grace period")
  }
}

export class FileNotMarkedToBeDeleted extends Error {
  static readonly code = 6013
  readonly code = 6013
  readonly name = "FileNotMarkedToBeDeleted"
  readonly msg = "This file is not marked to be deleted"

  constructor(readonly logs?: string[]) {
    super("6013: This file is not marked to be deleted")
  }
}

export class FileMarkedImmutable extends Error {
  static readonly code = 6014
  readonly code = 6014
  readonly name = "FileMarkedImmutable"
  readonly msg = "File has been marked as immutable and cannot be edited"

  constructor(readonly logs?: string[]) {
    super("6014: File has been marked as immutable and cannot be edited")
  }
}

export class NoStorageIncrease extends Error {
  static readonly code = 6015
  readonly code = 6015
  readonly name = "NoStorageIncrease"
  readonly msg = "User requested an increase of zero bytes"

  constructor(readonly logs?: string[]) {
    super("6015: User requested an increase of zero bytes")
  }
}

export class ExceededStorageLimit extends Error {
  static readonly code = 6016
  readonly code = 6016
  readonly name = "ExceededStorageLimit"
  readonly msg = "Requested a storage account with storage over the limit"

  constructor(readonly logs?: string[]) {
    super("6016: Requested a storage account with storage over the limit")
  }
}

export class InsufficientFunds extends Error {
  static readonly code = 6017
  readonly code = 6017
  readonly name = "InsufficientFunds"
  readonly msg =
    "User does not have enough funds to store requested number of bytes."

  constructor(readonly logs?: string[]) {
    super(
      "6017: User does not have enough funds to store requested number of bytes."
    )
  }
}

export class NotEnoughStorageOnShadowDrive extends Error {
  static readonly code = 6018
  readonly code = 6018
  readonly name = "NotEnoughStorageOnShadowDrive"
  readonly msg = "There is not available storage on Shadow Drive. Good job!"

  constructor(readonly logs?: string[]) {
    super("6018: There is not available storage on Shadow Drive. Good job!")
  }
}

export class AccountTooSmall extends Error {
  static readonly code = 6019
  readonly code = 6019
  readonly name = "AccountTooSmall"
  readonly msg = "Requested a storage account with storage under the limit"

  constructor(readonly logs?: string[]) {
    super("6019: Requested a storage account with storage under the limit")
  }
}

export class DidNotAgreeToToS extends Error {
  static readonly code = 6020
  readonly code = 6020
  readonly name = "DidNotAgreeToToS"
  readonly msg = "User did not agree to terms of service"

  constructor(readonly logs?: string[]) {
    super("6020: User did not agree to terms of service")
  }
}

export class InvalidTokenTransferAmounts extends Error {
  static readonly code = 6021
  readonly code = 6021
  readonly name = "InvalidTokenTransferAmounts"
  readonly msg = "Invalid token transfers. Stake account nonempty."

  constructor(readonly logs?: string[]) {
    super("6021: Invalid token transfers. Stake account nonempty.")
  }
}

export class FailedToCloseAccount extends Error {
  static readonly code = 6022
  readonly code = 6022
  readonly name = "FailedToCloseAccount"
  readonly msg = "Failed to close spl token account"

  constructor(readonly logs?: string[]) {
    super("6022: Failed to close spl token account")
  }
}

export class FailedToTransferToEmissionsWallet extends Error {
  static readonly code = 6023
  readonly code = 6023
  readonly name = "FailedToTransferToEmissionsWallet"
  readonly msg = "Failed to transfer to emissions wallet"

  constructor(readonly logs?: string[]) {
    super("6023: Failed to transfer to emissions wallet")
  }
}

export class FailedToTransferToEmissionsWalletFromUser extends Error {
  static readonly code = 6024
  readonly code = 6024
  readonly name = "FailedToTransferToEmissionsWalletFromUser"
  readonly msg = "Failed to transfer to emissions wallet from user"

  constructor(readonly logs?: string[]) {
    super("6024: Failed to transfer to emissions wallet from user")
  }
}

export class FailedToReturnUserFunds extends Error {
  static readonly code = 6025
  readonly code = 6025
  readonly name = "FailedToReturnUserFunds"
  readonly msg = "Failed to return user funds"

  constructor(readonly logs?: string[]) {
    super("6025: Failed to return user funds")
  }
}

export class NeedSomeFees extends Error {
  static readonly code = 6026
  readonly code = 6026
  readonly name = "NeedSomeFees"
  readonly msg =
    "Turning on fees and passing in None for storage cost per epoch"

  constructor(readonly logs?: string[]) {
    super(
      "6026: Turning on fees and passing in None for storage cost per epoch"
    )
  }
}

export class NeedSomeCrankBps extends Error {
  static readonly code = 6027
  readonly code = 6027
  readonly name = "NeedSomeCrankBps"
  readonly msg = "Turning on fees and passing in None for crank bps"

  constructor(readonly logs?: string[]) {
    super("6027: Turning on fees and passing in None for crank bps")
  }
}

export class AlreadyMarkedForDeletion extends Error {
  static readonly code = 6028
  readonly code = 6028
  readonly name = "AlreadyMarkedForDeletion"
  readonly msg = "This account is already marked to be deleted"

  constructor(readonly logs?: string[]) {
    super("6028: This account is already marked to be deleted")
  }
}

export class EmptyStakeAccount extends Error {
  static readonly code = 6029
  readonly code = 6029
  readonly name = "EmptyStakeAccount"
  readonly msg =
    "User has an empty stake account and must refresh stake account before unmarking account for deletion"

  constructor(readonly logs?: string[]) {
    super(
      "6029: User has an empty stake account and must refresh stake account before unmarking account for deletion"
    )
  }
}

export class IdentifierExceededMaxLength extends Error {
  static readonly code = 6030
  readonly code = 6030
  readonly name = "IdentifierExceededMaxLength"
  readonly msg = "New identifier exceeds maximum length of 64 bytes"

  constructor(readonly logs?: string[]) {
    super("6030: New identifier exceeds maximum length of 64 bytes")
  }
}

export class OnlyAdmin1CanChangeAdmins extends Error {
  static readonly code = 6031
  readonly code = 6031
  readonly name = "OnlyAdmin1CanChangeAdmins"
  readonly msg = "Only admin1 can change admins"

  constructor(readonly logs?: string[]) {
    super("6031: Only admin1 can change admins")
  }
}

export class OnlyOneOwnerAllowedInV1_5 extends Error {
  static readonly code = 6032
  readonly code = 6032
  readonly name = "OnlyOneOwnerAllowedInV1_5"
  readonly msg =
    "(As part of on-chain storage optimizations, only one owner is allowed in Shadow Drive v1.5)"

  constructor(readonly logs?: string[]) {
    super(
      "6032: (As part of on-chain storage optimizations, only one owner is allowed in Shadow Drive v1.5)"
    )
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new NotEnoughStorage(logs)
    case 6001:
      return new FileNameLengthExceedsLimit(logs)
    case 6002:
      return new InvalidSha256Hash(logs)
    case 6003:
      return new HasHadBadCsam(logs)
    case 6004:
      return new StorageAccountMarkedImmutable(logs)
    case 6005:
      return new ClaimingStakeTooSoon(logs)
    case 6006:
      return new SolanaStorageAccountNotMutable(logs)
    case 6007:
      return new RemovingTooMuchStorage(logs)
    case 6008:
      return new UnsignedIntegerCastFailed(logs)
    case 6009:
      return new NonzeroRemainingFileAccounts(logs)
    case 6010:
      return new AccountStillInGracePeriod(logs)
    case 6011:
      return new AccountNotMarkedToBeDeleted(logs)
    case 6012:
      return new FileStillInGracePeriod(logs)
    case 6013:
      return new FileNotMarkedToBeDeleted(logs)
    case 6014:
      return new FileMarkedImmutable(logs)
    case 6015:
      return new NoStorageIncrease(logs)
    case 6016:
      return new ExceededStorageLimit(logs)
    case 6017:
      return new InsufficientFunds(logs)
    case 6018:
      return new NotEnoughStorageOnShadowDrive(logs)
    case 6019:
      return new AccountTooSmall(logs)
    case 6020:
      return new DidNotAgreeToToS(logs)
    case 6021:
      return new InvalidTokenTransferAmounts(logs)
    case 6022:
      return new FailedToCloseAccount(logs)
    case 6023:
      return new FailedToTransferToEmissionsWallet(logs)
    case 6024:
      return new FailedToTransferToEmissionsWalletFromUser(logs)
    case 6025:
      return new FailedToReturnUserFunds(logs)
    case 6026:
      return new NeedSomeFees(logs)
    case 6027:
      return new NeedSomeCrankBps(logs)
    case 6028:
      return new AlreadyMarkedForDeletion(logs)
    case 6029:
      return new EmptyStakeAccount(logs)
    case 6030:
      return new IdentifierExceededMaxLength(logs)
    case 6031:
      return new OnlyAdmin1CanChangeAdmins(logs)
    case 6032:
      return new OnlyOneOwnerAllowedInV1_5(logs)
  }

  return null
}
