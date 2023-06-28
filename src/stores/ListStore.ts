import { action, makeObservable, observable, runInAction } from "mobx";
import { RootStore } from "./RootStore";
import { BaseStore, baseStoreProps } from "./BaseStore";

interface DoToItem {
  title: string;
  id: number;
}

export class ListStore extends BaseStore {
  step = 0;

  list: DoToItem[] = [];

  constructor(rootStore: RootStore) {
    super(rootStore);
    makeObservable(this, {
      ...baseStoreProps,
      step: observable,
      setStep: action,
    });
    setInterval(() => {
      runInAction(() => {
        this.step++;
      });
    }, 1000);
  }

  clear() {
    this.list = [];
  }

  setStep() {
    this.step = 10;
  }
}
