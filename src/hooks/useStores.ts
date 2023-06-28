import { stores } from "@/stores";

import { createContext, useContext } from "react";

export const StoreContext = createContext(stores);

export const useStores = () => {
  return useContext<typeof stores>(StoreContext);
};
