import { action, computed, makeObservable, observable, toJS } from "mobx";
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
      fetchError: observable,
      init: action,
      setSelectedAccount: action,
      selectedAccount: computed,
      fetchBalance0: action,
      fetchBalance1: action,
      fetchBalance2: action,
    });
  }

  setAdapter(adapter: LedgerWalletAdapter1) {
    this._adapter = adapter;
  }

  async init() {
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

    this.accounts0 = this.accounts?.filter(
      (account) => account.account === undefined && account.change === undefined,
    );
    this.accounts1 = this.accounts?.filter(
      (account) => account.account !== undefined && account.change === undefined,
    );
    this.accounts2 = this.accounts?.filter(
      (account) => account.account !== undefined && account.change !== undefined,
    );
  }

  private async fetchBalance(accounts: LedgerHDWalletAccount[] | undefined, statusField?: keyof this) {
    await this.statusHandler(
      async () => {
        console.log(200, toJS(accounts));

        if (!this._adapter || !accounts) {
          return;
        }

        const publicKeys = accounts?.map(account => account.publicKey);

        console.log(210, publicKeys[0].toBase58());

        if (!publicKeys) {
          return;
        }

        console.log(210, publicKeys[0].toBase58());

        const balances = await solanaService.getMultipleAccountInfo(publicKeys);

        console.log(222, balances);

        if (!accounts) {
          return;
        }


        for (let i = 0; i < accounts?.length; i++ ) {
          accounts[i].balance = balances[i]?.lamports; 
        }

        console.log(225, toJS(accounts));
      },
      statusField,
    );
  }

  public async fetchBalance0() {
    await this.fetchBalance(this.accounts0, "fetchStatus0");
  }

  public async fetchBalance1() {
    await this.fetchBalance(this.accounts1, "fetchStatus1");
  }

  public async fetchBalance2() {
    await this.fetchBalance(this.accounts2, "fetchStatus2");
  }

  public setSelectedAccount(account: LedgerHDWalletAccount) {
    this._selectedAccount = account;
  }

  public get selectedAccount() {
    return this._selectedAccount;
  }
}
