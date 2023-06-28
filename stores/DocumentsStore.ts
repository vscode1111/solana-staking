import { observable } from "mobx";
import { BaseStore, RootStore } from "@/stores";

export class DocumentsStore extends BaseStore {
  @observable
  movingDocumentId: string | null | undefined;

  constructor(rootStore: RootStore) {
    super(rootStore);
  }
}
