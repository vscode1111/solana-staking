import { InflationReward, PublicKey, StakeActivationData, VoteAccountInfo } from "@solana/web3.js";
import { ParsedAccountInfo, Reward, StakeAccount, ValidatorInfo } from "./types";

const DECIMAL_FACTOR = 1e9;

export function mapAccountFn(
  key: PublicKey,
  info: ParsedAccountInfo,
  state: StakeActivationData,
): StakeAccount {
  return {
    stakeAccount: key.toBase58(),
    solBalance: undefined,
    status: state.state,
    activeStake: Number(info.info.stake?.delegation?.stake ?? 0) / DECIMAL_FACTOR,
    validator: info.info.stake?.delegation?.voter ?? "",
    rewardSol: undefined,
  };
}

export function mapRewardFn(reward: InflationReward): Reward {
  return {
    ...reward,
    amount: reward.amount / DECIMAL_FACTOR,
    postBalance: reward.postBalance / DECIMAL_FACTOR,
  };
}

export function mapValidatorFn(voteAccountInfo: VoteAccountInfo): ValidatorInfo {
  return {
    votePubkey: voteAccountInfo.votePubkey,
    nodePubkey: voteAccountInfo.nodePubkey,
    activatedStake: voteAccountInfo.activatedStake / DECIMAL_FACTOR,
    commission: voteAccountInfo.commission,
  };
}
