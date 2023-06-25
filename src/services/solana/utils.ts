import { InflationReward, StakeActivationData, VoteAccountInfo } from "@solana/web3.js";
import {
  ParsedAccountInfo,
  ProgramAccountInfo,
  Reward,
  StakeAccount,
  ValidatorInfo,
} from "./types";

export function mapAccountFn(
  account: ProgramAccountInfo,
  info: ParsedAccountInfo,
  state: StakeActivationData,
): StakeAccount {
  return {
    stakeAccount: account.pubkey.toBase58(),
    solBalance: undefined,
    status: state.state,
    activeStake: Number(info.info.stake?.delegation?.stake ?? 0),
    // activeStakeRaw: Number(info.info.stake?.delegation?.stake ?? 0),
    lamports: Number(account.account.lamports ?? 0),
    // activeStakeRaw: Number(123),
    validator: info.info.stake?.delegation?.voter ?? "",
    rewardSol: undefined,
  };
}

export function mapRewardFn(reward: InflationReward): Reward {
  return {
    ...reward,
    amount: reward.amount,
    postBalance: reward.postBalance,
  };
}

export function mapValidatorFn(voteAccountInfo: VoteAccountInfo): ValidatorInfo {
  return {
    votePubkey: voteAccountInfo.votePubkey,
    nodePubkey: voteAccountInfo.nodePubkey,
    activatedStake: voteAccountInfo.activatedStake,
    commission: voteAccountInfo.commission,
  };
}
