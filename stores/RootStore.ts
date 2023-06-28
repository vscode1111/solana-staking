import { BaseStore } from "./BaseStore";
import { DocumentsStore } from "./DocumentsStore";

export class RootStore extends BaseStore {
  documents: DocumentsStore;

  constructor(rootStore: RootStore) {
    super(rootStore)
    this.documents = new DocumentsStore(this);
  }

  logout() {
    this.documents.clear();
  }
}
