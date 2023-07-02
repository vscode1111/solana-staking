import { LedgerStore } from "./LedgerStore";
import { ModalsStore } from "./ModalsStore";
import { StakingStore } from "./StakingStore";

export class RootStore {
  public modals: ModalsStore;
  public ledger: LedgerStore;
  public staking: StakingStore;

  constructor() {
    this.modals = new ModalsStore(this);
    this.ledger = new LedgerStore(this);
    this.staking = new StakingStore(this);
  }
}
