import { action, computed, makeObservable, observable } from "mobx";
import { RootStore } from "./RootStore";
import { BaseStore, baseStoreProps } from "./BaseStore";
import { LedgerHDWalletAccount, LedgerWalletAdapter1, getLedgerPathList } from "@/utils";
import { NormalizedError, StatusFetching } from "./types";
import { solanaService } from "@/services";

export class LedgerStore extends BaseStore {
  private _adapter?: LedgerWalletAdapter1;
  private _selectedAccount?: LedgerHDWalletAccount;

  public accounts?: LedgerHDWalletAccount[];
  public accounts0?: LedgerHDWalletAccount[];
  public accounts1?: LedgerHDWalletAccount[];
  public accounts2?: LedgerHDWalletAccount[];

  public fetchStatus: StatusFetching = "init";
  public fetchError: NormalizedError;

  public fetchStatus0: StatusFetching = "init";
  public fetchStatus1: StatusFetching = "init";
  public fetchStatus2: StatusFetching = "init";

  constructor(rootStore: RootStore) {
    super(rootStore);
    makeObservable(this, {
      ...baseStoreProps,
      accounts: observable,
      accounts0: observable,
      accounts1: observable,
      accounts2: observable,
      fetchStatus: observable,
      fetchStatus0: observable,
      fetchStatus1: observable,
      fetchStatus2: observable,
      fetchError: observable,
      init: action,
      setSelectedAccount: action,
      selectedAccount: computed,
    });
  }

  setAdapter(adapter: LedgerWalletAdapter1) {
    this._adapter = adapter;
  }

  async init() {
    await this.fetchAddresses();

    this.accounts0 = this.accounts?.filter(
      (account) => account.account === undefined && account.change === undefined,
    );
    this.accounts1 = this.accounts?.filter(
      (account) => account.account !== undefined && account.change === undefined,
    );
    this.accounts2 = this.accounts?.filter(
      (account) => account.account !== undefined && account.change !== undefined,
    );

    await this.fetchBalance0();
    await this.fetchBalance1();
    await this.fetchBalance2();
  }

  public async fetchAddresses() {
    await this.statusHandler(
      async () => {
        if (!this._adapter) {
          return;
        }

        const paths = getLedgerPathList();
        this.accounts = await this._adapter.fetchAccountsForPaths(paths);
      },
      "fetchStatus",
      "fetchError",
    );
  }

  private async fetchBalance(
    accounts: LedgerHDWalletAccount[] | undefined,
    statusField?: keyof this,
  ) {
    await this.statusHandler(async () => {
      if (!this._adapter || !accounts) {
        return;
      }

      const publicKeys = accounts?.map((account) => account.publicKey);

      if (!publicKeys) {
        return;
      }

      const balances = await solanaService.getMultipleAccountInfo(publicKeys);
      // const balances = [559611719].map((item) => ({ lamports: item }));
      // await sleep(1000);

      if (!accounts) {
        return;
      }

      for (let i = 0; i < accounts?.length; i++) {
        accounts[i].balance = balances[i]?.lamports;
      }
    }, statusField);
  }

  private async fetchBalance0() {
    await this.fetchBalance(this.accounts0, "fetchStatus0");
  }

  private async fetchBalance1() {
    await this.fetchBalance(this.accounts1, "fetchStatus1");
  }

  private async fetchBalance2() {
    await this.fetchBalance(this.accounts2, "fetchStatus2");
  }

  public setSelectedAccount(account: LedgerHDWalletAccount) {
    this._selectedAccount = account;
  }

  public get selectedAccount() {
    return this._selectedAccount;
  }
}
