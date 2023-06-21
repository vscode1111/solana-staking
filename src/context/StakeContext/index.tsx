import { ComponentProps, createContext, useContext, useMemo, useState } from "react";

import { StakeAccount } from "@services";

interface ISakingContext {
  stakeAccountInfos: StakeAccount[];
  setStakeAccountInfos: (value: StakeAccount[]) => void;
}

const StakeContext = createContext<ISakingContext>({
  stakeAccountInfos: [],
  setStakeAccountInfos: () => null,
});

export function useStake() {
  const context = useContext(StakeContext);
  if (!context) {
    throw new Error(`useTrain must be used within a StakeContext`);
  }
  return context;
}

export function StakeProvider(props: ComponentProps<any>) {
  const [stakeAccountInfos, setStakeAccountInfos] = useState<StakeAccount[]>([]);
  const stakeAccountInfosValue = useMemo(
    () => ({ stakeAccountInfos, setStakeAccountInfos }),
    [stakeAccountInfos],
  );

  return (
    <StakeContext.Provider
      value={{
        ...stakeAccountInfosValue,
      }}
      {...props}
    />
  );
}
