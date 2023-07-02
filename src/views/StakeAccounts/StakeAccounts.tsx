import { Button, Drawer } from "@mui/material";
import { useStakeAccountsStyles } from "./useStakeAccountsStyles";
import { Link } from "react-router-dom";
import { useState } from "react";
import { StakeAccount } from "@/services";
import { uid } from "react-uid";
import { Loader } from "@/components";
import { ROUTE } from "@/consts";
import { printValue } from "@/utils";
import { DrawerContent } from "./components";
import { useInitWalletEffect, useStores } from "@/hooks";
import { observer } from "mobx-react-lite";

export const StakeAccounts = observer(() => {
  const { classes } = useStakeAccountsStyles();
  const [stakeAccount, setStakeAccount] = useState<StakeAccount | null>(null);

  const { staking } = useStores();
  const { stakeAccountInfos, isFetching } = staking;

  useInitWalletEffect((wallet) => {
    if (!wallet.publicKey) {
      return;
    }

    staking.fetchStakeAccountInfos(wallet.publicKey);
  });

  return (
    <div className={classes.root}>
      <div className={classes.navigation}>
        <Link to={`/`}>
          <Button>Back</Button>
        </Link>
        {!isFetching && (
          <Link to={`/${ROUTE.VALIDATORS}`}>
            <Button>Add</Button>
          </Link>
        )}
      </div>
      <div className={classes.content}>
        {isFetching ? (
          <Loader size={40} />
        ) : (
          <>
            {stakeAccountInfos.map((info) => (
              <Button key={uid(info)} onClick={() => setStakeAccount(info)}>
                {info.stakeAccount} - {info.status} - {printValue(info.activeStake)} -{" "}
                {printValue(info.lamports)}
              </Button>
            ))}
            <Drawer anchor="bottom" open={!!stakeAccount} onClose={() => setStakeAccount(null)}>
              {stakeAccount && (
                <DrawerContent stakeAccount={stakeAccount} onClose={() => setStakeAccount(null)} />
              )}
            </Drawer>
          </>
        )}
      </div>
    </div>
  );
});
