import { action, observable } from "mobx";
import { RootStore } from "./RootStore";

export abstract class BaseStore {
  isFetching = false;

  isSaving = false;

  isLoaded = false;

  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  clear() { }
}
