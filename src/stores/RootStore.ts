import { ListStore } from "./ListStore";

export class RootStore {
  list: ListStore;

  constructor() {
    this.list = new ListStore(this);
  }

  logout() {
    this.list.clear();
  }
}
