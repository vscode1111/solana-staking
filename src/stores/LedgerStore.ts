import { action, computed, makeObservable, observable, toJS } from "mobx";
import { RootStore } from "./RootStore";
import { BaseStore, baseStoreProps } from "./BaseStore";
import { LedgerHDWalletAccount, LedgerWalletAdapter1, getLedgerPathList } from "@/utils";
import { NormalizedError, StatusFetching } from "./types";

export class LedgerStore extends BaseStore {
  private _adapter?: LedgerWalletAdapter1;
  private _selectedAccount?: LedgerHDWalletAccount;

  public accounts?: LedgerHDWalletAccount[];
  public accounts0?: LedgerHDWalletAccount[];
  public accounts1?: LedgerHDWalletAccount[];
  public accounts2?: LedgerHDWalletAccount[];

  public fetchStatus: StatusFetching = "init";
  public fetchError: NormalizedError;

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

    console.log(333, toJS(this.accounts));

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

  setSelectedAccount(account: LedgerHDWalletAccount) {
    this._selectedAccount = account;
    console.log(777, toJS(this._selectedAccount));
  }

  get selectedAccount() {
    console.log(778, toJS(this._selectedAccount));
    return this._selectedAccount;
  }
}
