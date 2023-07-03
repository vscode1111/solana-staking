import { action, computed, makeObservable, observable } from "mobx";
import { RootStore } from "./RootStore";
import { BaseStore, baseStoreProps } from "./BaseStore";
import { NormalizedError, StatusFetching } from "./types";
import { solanaService } from "@/services";
import { RpcResponseAndContext, SignatureStatus } from "@solana/web3.js";

export class TxModalsStore extends BaseStore {
  public open?: boolean;
  public tx?: string | void;
  public text?: string;
  public fetchStatus: StatusFetching = "init";
  public fetchError: NormalizedError;
  public txStatus?: RpcResponseAndContext<SignatureStatus | null>;
  public onClose?: () => any;

  constructor(rootStore: RootStore) {
    super(rootStore);
    makeObservable(this, {
      ...baseStoreProps,
      open: observable,
      tx: observable,
      text: observable,
      fetchStatus: observable,
      fetchError: observable,
      isFetching: computed,
      showTx: action,
      closeModal: action,
    });
  }

  public get isFetching() {
    return this.fetchStatus === "fetching";
  }

  public openModal(text?: string) {
    this.open = true;
    this.tx = "";
    this.text = text;
  }

  private async _showTx(tx: string | undefined | void, onFinish?: () => any) {
    this.tx = tx;
    await this.statusHandler(
      async () => {
        this.txStatus = await solanaService.waitSignatureStatus(this.tx as string);
      },
      "fetchStatus",
      "fetchError",
    );

    if (onFinish instanceof Function) {
      onFinish();
    }
  }

  public async showTx(tx: string | undefined | void, onFinish?: () => any) {
    await new Promise((res) => {
      this._showTx(tx, () => {
        res(0);
        if (onFinish instanceof Function) {
          onFinish();
        }
      });
    });
  }

  public closeModal() {
    this.open = false;
    this.tx = "";

    if (this.onClose instanceof Function) {
      this.onClose();
    }
  }
}
