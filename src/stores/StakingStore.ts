import { action, computed, makeObservable, observable } from "mobx";
import { RootStore } from "./RootStore";
import { BaseStore, baseStoreProps } from "./BaseStore";
import { NormalizedError, StatusFetching } from "./types";
import { StakeAccount, ValidatorInfo, solanaService } from "@/services";
import {
  Authorized,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Lockup,
  PublicKey,
  StakeProgram,
  Transaction,
} from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

export class StakingStore extends BaseStore {
  public balance: number;

  public stakeAccountInfos: StakeAccount[];
  public validators: ValidatorInfo[];

  public fetchStatus: StatusFetching = "init";
  public fetchError: NormalizedError;

  public actionStatus: StatusFetching = "init";
  public actionError: NormalizedError;

  constructor(rootStore: RootStore) {
    super(rootStore);
    makeObservable(this, {
      ...baseStoreProps,
      balance: observable,
      stakeAccountInfos: observable,
      fetchStatus: observable,
      fetchError: observable,
      isFetching: computed,
      actionStatus: observable,
      actionError: observable,
      isAction: computed,
      fetchBalance: action,
      setStakeAccountInfos: action,
      fetchValidators: action,
      deactivateStake: action,
    });

    this.balance = 0;
    this.stakeAccountInfos = [];
    this.validators = [];
  }

  public get isFetching() {
    return this.fetchStatus === "fetching";
  }

  public get isAction() {
    return this.actionStatus === "fetching";
  }

  public async fetchBalance(userAccountPublicKey: PublicKey) {
    await this.statusHandler(
      async () => {
        this.balance = await solanaService.getBalance(userAccountPublicKey);
      },
      "fetchStatus",
      "fetchError",
    );
  }

  public async fetchStakeAccountInfos(userAccountPublicKey: PublicKey) {
    await this.statusHandler(
      async () => {
        this.stakeAccountInfos = await solanaService.getStakeAccountInfos(userAccountPublicKey);
      },
      "fetchStatus",
      "fetchError",
    );
  }

  public async fetchValidators() {
    await this.statusHandler(
      async () => {
        this.validators = await solanaService.getCurrentValidators(10);
      },
      "fetchStatus",
      "fetchError",
    );
  }

  public setStakeAccountInfos(stakeAccountInfos: StakeAccount[]) {
    this.stakeAccountInfos = stakeAccountInfos;
  }

  public async delegateStake(
    wallet: WalletContextState,
    connection: Connection,
    stakeAccount: Keypair,
    votePubkey: string,
  ) {
    return this.statusHandler(
      async () => {
        if (!wallet.publicKey) {
          return;
        }

        const transaction1 = new Transaction();

        transaction1.add(
          StakeProgram.createAccount({
            authorized: new Authorized(wallet.publicKey, wallet.publicKey),
            fromPubkey: wallet.publicKey,
            lamports: 0.1 * LAMPORTS_PER_SOL,
            lockup: new Lockup(0, 0, wallet.publicKey),
            stakePubkey: stakeAccount.publicKey,
          }),
        );

        transaction1.add(
          StakeProgram.delegate({
            stakePubkey: stakeAccount.publicKey,
            authorizedPubkey: wallet.publicKey,
            votePubkey: new PublicKey(votePubkey),
          }),
        );

        return wallet.sendTransaction(transaction1, connection, {
          signers: [stakeAccount],
        });
      },
      "actionStatus",
      "actionError",
    );
  }

  public async mergeStake(
    wallet: WalletContextState,
    connection: Connection,
    stakeAccount: Keypair,
    foundStakeAccountInfo: StakeAccount,
  ) {
    return this.statusHandler(
      async () => {
        if (!wallet.publicKey) {
          return;
        }

        const transaction2 = new Transaction();
        transaction2.add(
          StakeProgram.merge({
            sourceStakePubKey: stakeAccount.publicKey,
            stakePubkey: new PublicKey(foundStakeAccountInfo.stakeAccount),
            authorizedPubkey: wallet.publicKey,
          }),
        );

        return wallet.sendTransaction(transaction2, connection);
      },
      "actionStatus",
      "actionError",
    );
  }

  public async deactivateStake(
    wallet: WalletContextState,
    connection: Connection,
    stakeAccount: StakeAccount,
  ) {
    return this.statusHandler(
      async () => {
        if (!wallet.publicKey) {
          return;
        }

        const transaction1 = new Transaction();

        transaction1.add(
          StakeProgram.deactivate({
            stakePubkey: new PublicKey(stakeAccount.stakeAccount),
            authorizedPubkey: wallet.publicKey,
          }),
        );

        return wallet.sendTransaction(transaction1, connection);
      },
      "actionStatus",
      "actionError",
    );
  }

  public async withdrawStake(
    wallet: WalletContextState,
    connection: Connection,
    stakeAccount: StakeAccount,
  ) {
    return this.statusHandler(
      async () => {
        if (!wallet.publicKey) {
          return;
        }

        const transaction1 = new Transaction();

        transaction1.add(
          StakeProgram.withdraw({
            stakePubkey: new PublicKey(stakeAccount.stakeAccount),
            authorizedPubkey: wallet.publicKey,
            toPubkey: wallet.publicKey,
            lamports: stakeAccount.lamports,
          }),
        );

        return wallet.sendTransaction(transaction1, connection);
      },
      "actionStatus",
      "actionError",
    );
  }
}
