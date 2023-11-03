import {
  AccountInfo,
  Authorized,
  Connection,
  Keypair,
  ParsedAccountData,
  PublicKey,
  StakeProgram,
  TransactionConfirmationStatus,
} from "@solana/web3.js";
import { InflationRewardNull, ParsedAccountInfo, RewardNull, StakeAccount } from "./types";
import { mapAccountFn, mapRewardFn, mapValidatorFn } from "./utils";
import { sleep } from "@/utils";
import { BASE_RPC_URL } from "@/consts";

export class Solana {
  private connection: Connection;

  constructor() {
    // this.connection = new Connection(clusterApiUrl("mainnet-beta"));
    this.connection = new Connection(BASE_RPC_URL);
  }

  public async getAccountInfo(userAccountPublicKey: PublicKey): Promise<ParsedAccountInfo> {
    const accountInfo = await this.connection.getParsedAccountInfo(userAccountPublicKey);
    console.log(111, accountInfo);
    return (accountInfo.value?.data as ParsedAccountData).parsed as ParsedAccountInfo;
  }

  public async getMultipleAccountInfo(
    publicKeys: PublicKey[],
  ): Promise<(AccountInfo<Buffer | ParsedAccountData> | null)[]> {
    const accountInfo = await this.connection.getMultipleAccountsInfo(publicKeys);
    return accountInfo;
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
    const programAccounts = await this.connection.getParsedProgramAccounts(programId, {
      filters: [{ memcmp: { offset: 44, bytes: userAccountPublicKey.toBase58() } }],
    });
    const result: StakeAccount[] = [];
    await Promise.all(
      programAccounts.map(async (account) => {
        const info = await this.getAccountInfo(account.pubkey);
        const state = await this.connection.getStakeActivation(account.pubkey);
        const StakeAccount = mapAccountFn(account, info, state);
        result.push(StakeAccount);
        return info;
      }),
    );
    const sortedResult = result.sort((a, b) => b.activeStake - a.activeStake);
    return sortedResult;
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
    return this.connection.getBalance(userAccountPublicKey);
  }

  public async getValidators(limit?: number) {
    const { current } = await this.connection.getVoteAccounts("recent");
    const sortedCurrent = current.sort((a, b) => b.activatedStake - a.activatedStake);
    return limit
      ? sortedCurrent.slice(0, limit).map(mapValidatorFn)
      : sortedCurrent.map(mapValidatorFn);
  }

  public async createStakeAccountTx(userAccountPublicKey: PublicKey, amountToStake: number) {
    const stakeAccount = Keypair.generate();

    const createStakeAccountTx = StakeProgram.createAccount({
      authorized: new Authorized(userAccountPublicKey, userAccountPublicKey), // Here we set two authorities: Stake Authority and Withdrawal Authority. Both are set to our wallet.
      fromPubkey: userAccountPublicKey,
      lamports: amountToStake,
      // lockup: new Lockup(0, 0, wallet.publicKey), // Optional. We'll set this to 0 for demonstration purposes.
      stakePubkey: stakeAccount.publicKey,
    });

    return createStakeAccountTx;
  }

  public async getDelegatorByValidator(validatorPublicKey: string) {
    const STAKE_PROGRAM_ID = new PublicKey("Stake11111111111111111111111111111111111111");

    const accounts = await this.connection.getParsedProgramAccounts(STAKE_PROGRAM_ID, {
      filters: [
        {
          dataSize: 200, // number of bytes
        },
        {
          memcmp: {
            offset: 124, // number of bytes
            bytes: validatorPublicKey, // base58 encoded string
          },
        },
      ],
    });
    return accounts;
  }

  public async getSignatureStatus(txSignature: string) {
    return await this.connection.getSignatureStatus(txSignature);
  }

  public async waitSignatureStatus(
    txSignature: string,
    status: TransactionConfirmationStatus = "finalized",
    // status: TransactionConfirmationStatus = 'confirmed',
    delayMs = 5000,
    maxAttempts = 10,
  ) {
    for (let i = 0; i < maxAttempts; i++) {
      const txStatus = await this.getSignatureStatus(txSignature);

      // if (txStatus.value?.confirmationStatus === status || txStatus.value === null) {
      if (txStatus.value?.confirmationStatus === status) {
        return txStatus;
      }

      await sleep(delayMs);
    }

    throw new Error("Reached the maximum number of attempts");
  }
}
