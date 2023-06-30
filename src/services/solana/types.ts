import { AccountInfo, InflationReward, ParsedAccountData, PublicKey } from "@solana/web3.js";

//Solana interfaces
export interface ParsedAccountInfo {
  info: Info;
  type: string;
}

export interface Info {
  meta: Meta;
  stake: Stake;
}

export interface Meta {
  authorized: Authorized;
  lockup: Lockup;
  rentExemptReserve: string;
}

export interface Authorized {
  staker: string;
  withdrawer: string;
}

export interface Lockup {
  custodian: string;
  epoch: number;
  unixTimestamp: number;
}

export interface Stake {
  creditsObserved: number;
  delegation: Delegation;
}

export interface Delegation {
  activationEpoch: string;
  deactivationEpoch: string;
  stake: string;
  voter: string;
  warmupCooldownRate: number;
}

// Custom interfaces

export interface StakeAccount {
  stakeAccount: string;
  solBalance?: number;
  status: string;
  activeStake: number;
  lamports: number;
  validator: string;
  rewardSol?: number;
}

export type InflationRewardNull = InflationReward | null;

export type Reward = InflationReward;

export type RewardNull = Reward | null;

export interface ValidatorInfo {
  votePubkey: string;
  nodePubkey: string;
  activatedStake: number;
  commission: number;
}

export interface ProgramAccountInfo {
  pubkey: PublicKey;
  account: AccountInfo<Buffer | ParsedAccountData>;
}
