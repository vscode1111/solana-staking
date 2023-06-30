import { LedgerStore } from "./LedgerStore";
import { ModalsStore } from "./ModalsStore";

export class RootStore {
  public modals: ModalsStore;
  public ledger: LedgerStore;

  constructor() {
    this.modals = new ModalsStore(this);
    this.ledger = new LedgerStore(this);
  }
}
