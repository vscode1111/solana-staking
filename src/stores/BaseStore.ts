import { RootStore } from "@/stores";
import { sleep } from "@/utils";
import { action, makeObservable, runInAction } from "mobx";

export const baseStoreProps: Partial<Record<keyof BaseStore, any>> = {
  // statusHandler: action,
};

export abstract class BaseStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable(this, {
      statusHandler: action,
    });
  }

  statusHandler = <T>(
    actionFunc: () => Promise<T>,
    statusField?: keyof this,
    errorField?: keyof this,
    onSuccess?: (res: T) => Promise<void>,
  ): Promise<void | T> => {
    const statusFieldStr = String(statusField);
    const errorFieldStr = String(errorField);

    if (statusField) {
      (this as any)[statusFieldStr] = "fetching";
    }
    if (errorFieldStr) {
      (this as any)[errorFieldStr] = null;
    }

    return actionFunc()
      .then(async (result) => {
        await sleep(0);
        if (onSuccess) await onSuccess(result);
        return result;
      })
      .then((res) => {
        runInAction(() => {
          (this as any)[statusFieldStr] = "success";
        });

        return Promise.resolve(res);
      })
      .catch((err: any) => {
        console.error(err);

        runInAction(() => {
          if (errorFieldStr) {
            (this as any)[errorFieldStr] = err;
          }

          if (statusFieldStr) {
            (this as any)[statusFieldStr] = "error";
          }
        });

        // throw err;
      });
  };
}
