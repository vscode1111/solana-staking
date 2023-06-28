import { ListStore } from "./ListStore";
import { RootStore } from "./RootStore";

export interface IStores {
  list: ListStore;
}

// export const stores: IStores = {
//   list: new ListStore();
// };

// export const stores: IStores = {};
// stores.list = new ListStore();

export const stores = new RootStore();

if (!process.env.production) {
  window.stores = stores;
}
