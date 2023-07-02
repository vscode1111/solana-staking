import { action, computed, makeObservable, observable } from "mobx";
import { RootStore } from "./RootStore";
import { BaseStore, baseStoreProps } from "./BaseStore";
import { NormalizedError, StatusFetching } from "./types";
import { StakeAccount, ValidatorInfo, solanaService } from "@/services";
import { PublicKey } from "@solana/web3.js";
import { sleep } from "@/utils";

export class StakingStore extends BaseStore {
  public stakeAccountInfos: StakeAccount[];
  public validators: ValidatorInfo[];

  public fetchStatus: StatusFetching = "init";
  public fetchError: NormalizedError;

  constructor(rootStore: RootStore) {
    super(rootStore);
    makeObservable(this, {
      ...baseStoreProps,
      stakeAccountInfos: observable,
      fetchStatus: observable,
      fetchError: observable,
      isFetching: computed,
      setStakeAccountInfos: action,
      fetchValidators: action,
    });

    this.stakeAccountInfos = [];
    this.validators = [];
  }

  public get isFetching() {
    return this.fetchStatus === "fetching";
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
        console.log(344, "fetchValidators");
        this.validators = await solanaService.getCurrentValidators(10);
      },
      "fetchStatus",
      "fetchError",
    );
  }

  public setStakeAccountInfos(stakeAccountInfos: StakeAccount[]) {
    this.stakeAccountInfos = stakeAccountInfos;
  }
}
