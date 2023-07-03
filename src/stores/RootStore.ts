import { LedgerStore } from "./LedgerStore";
import { ModalsStore } from "./ModalsStore";
import { StakingStore } from "./StakingStore";
import { TxModalsStore } from "./TxModalsStore";

export class RootStore {
  public modals: ModalsStore;
  public txModals: TxModalsStore;
  public ledger: LedgerStore;
  public staking: StakingStore;

  constructor() {
    this.modals = new ModalsStore(this);
    this.txModals = new TxModalsStore(this);
    this.ledger = new LedgerStore(this);
    this.staking = new StakingStore(this);
  }
}
