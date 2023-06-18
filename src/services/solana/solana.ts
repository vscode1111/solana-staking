import {
  Authorized,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  ParsedAccountData,
  PublicKey,
  StakeProgram,
  clusterApiUrl,
} from "@solana/web3.js";
import { InflationRewardNull, ParsedAccountInfo, RewardNull, StakeAccount } from "./types";
import { mapAccountFn, mapRewardFn, mapValidatorFn } from "./utils";

export class Solana {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(clusterApiUrl("mainnet-beta"));
  }

  public async getAccountInfo(userAccountPublicKey: PublicKey): Promise<ParsedAccountInfo> {
    const accountInfo = await this.connection.getParsedAccountInfo(userAccountPublicKey);
    return (accountInfo.value?.data as ParsedAccountData).parsed as ParsedAccountInfo;
    // return (accountInfo.value?.data as ParsedAccountData);
  }

  public async getStakeAccounts(userAccountPublicKey: PublicKey) {
    const programId = StakeProgram.programId;
    const programAccounts = await this.connection.getProgramAccounts(programId, {
      filters: [{ memcmp: { offset: 44, bytes: userAccountPublicKey.toBase58() } }],
    });
    return programAccounts.map((account) => new PublicKey(account.pubkey));
  }

  public async getStakeAccountInfos(userAccountPublicKey: PublicKey) {
    const programId = StakeProgram.programId;
    const programAccounts = await this.connection.getProgramAccounts(programId, {
      filters: [{ memcmp: { offset: 44, bytes: userAccountPublicKey.toBase58() } }],
    });
    const stakeAccountPublicKeys = programAccounts.map((account) => new PublicKey(account.pubkey));
    const result: StakeAccount[] = [];
    await Promise.all(
      stakeAccountPublicKeys.map(async (key) => {
        const info = await this.getAccountInfo(key);
        const state = await this.connection.getStakeActivation(key);
        const StakeAccount = mapAccountFn(key, info, state);
        result.push(StakeAccount);
        return info;
      }),
    );
    return result;
  }

  public async getRewards(
    stakeAccountPublicKey: PublicKey,
    epoch?: number,
  ): Promise<InflationRewardNull[]> {
    return await this.connection.getInflationReward([stakeAccountPublicKey], epoch);
  }

  public async getAllRewards(
    stakeAccountPublicKey: PublicKey,
    startEpoch: number,
    endEpoch: number,
  ): Promise<RewardNull[]> {
    const result: RewardNull[] = [];

    for (let i = startEpoch; i <= endEpoch; i++) {
      const rewards = await this.getRewards(stakeAccountPublicKey, i);

      const mappedRewards = rewards.map((reward) => (reward ? mapRewardFn(reward) : null));

      result.push(...mappedRewards);
      if (rewards.length > 0) {
        console.log(rewards[0]?.epoch);
      }
    }

    return result;
  }

  public async getBalance(userAccountPublicKey: PublicKey) {
    const balance = await this.connection.getBalance(userAccountPublicKey);
    return balance / LAMPORTS_PER_SOL;
  }

  public async getCurrentValidators(limit?: number) {
    const { current } = await this.connection.getVoteAccounts("recent");
    return limit ? current.slice(0, limit).map(mapValidatorFn) : current.map(mapValidatorFn);
  }

  public async createStakeAccountTx(
    userAccountPublicKey: PublicKey,
    amountToStake: number,
  ) {
    const stakeAccount = Keypair.generate();

    const createStakeAccountTx = StakeProgram.createAccount({
      authorized: new Authorized(userAccountPublicKey, userAccountPublicKey), // Here we set two authorities: Stake Authority and Withdrawal Authority. Both are set to our wallet.
      fromPubkey: userAccountPublicKey,
      lamports: amountToStake,
      // lockup: new Lockup(0, 0, wallet.publicKey), // Optional. We'll set this to 0 for demonstration purposes.
      stakePubkey: stakeAccount.publicKey,
    });

    // const createStakeAccountTxId = await sendAndConfirmTransaction(
    //   this.connection,
    //   createStakeAccountTx,
    //   [
    //     // wallet,
    //     stakeAccount, // Since we're creating a new stake account, we have that account sign as well
    //   ],
    // );

    return createStakeAccountTx;
  }
}
