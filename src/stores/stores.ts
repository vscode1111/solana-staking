import { RootStore } from "./RootStore";

export const stores = new RootStore();

if (!process.env.production) {
  window.stores = stores;
}
