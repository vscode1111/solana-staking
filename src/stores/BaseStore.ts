import { RootStore } from "@/stores";
import { action, observable } from "mobx";

export const baseStoreProps: Partial<Record<keyof BaseStore, any>> = {
  isFetching: observable,
  isSaving: observable,
  incrementFetching: action,
  clear: action,
};

export abstract class BaseStore {
  isFetching = 0;
  isSaving = false;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  clear() {}

  incrementFetching() {
    this.isFetching++;
  }
}
