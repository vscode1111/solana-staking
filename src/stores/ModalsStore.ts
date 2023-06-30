import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./RootStore";
import { BaseStore, baseStoreProps } from "./BaseStore";
import { ReactRenderFn } from "./types";

export class ModalsStore extends BaseStore {
  public render?: ReactRenderFn | null;
  public onClose?: () => any;

  constructor(rootStore: RootStore) {
    super(rootStore);
    makeObservable(this, {
      ...baseStoreProps,
      render: observable,
      openModal: action,
      closeModal: action,
    });
  }

  public openModal = (render: ReactRenderFn, onClose?: () => any) => {
    this.render = render;
    this.onClose = onClose;
  };

  public closeModal = () => {
    this.render = null;

    if (this.onClose instanceof Function) {
      this.onClose();
    }
  };
}
