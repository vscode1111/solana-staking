import { LedgerStore } from "./LedgerStore";
import { ListStore } from "./ListStore";
import { ModalsStore } from "./ModalsStore";

export class RootStore {
  public list: ListStore;
  public modals: ModalsStore;
  public ledger: LedgerStore;

  constructor() {
    this.list = new ListStore(this);
    this.modals = new ModalsStore(this);
    this.ledger = new LedgerStore(this);
  }

  logout() {
    this.list.clear();
  }
}
