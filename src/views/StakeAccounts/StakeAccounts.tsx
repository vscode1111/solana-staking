import { Button, Drawer } from "@mui/material";
import { useStakeAccountsStyles } from "./useStakeAccountsStyles";
import { Link } from "react-router-dom";
import { useState } from "react";
import { StakeAccount, solanaService } from "@/services";
import { uid } from "react-uid";
import { Loader } from "@/components";
import { ROUTE } from "@/consts";
import { useWallet } from "@solana/wallet-adapter-react";
import { printJson, printSol } from "@/utils";
import { useStake } from "@/context";
import { DrawerContent } from "./components";
import { useInitEffect } from "@/hooks";

export function StakeAccounts() {
  const { classes } = useStakeAccountsStyles();
  const [stakeAccountInfos, setStakeAccountInfos] = useState<StakeAccount[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [stakeAccount, setStakeAccount] = useState<StakeAccount | null>(null);

  const wallet = useWallet();

  const stake = useStake();

  useInitEffect(() => {
    const asyncCall = async () => {
      if (wallet.connected && wallet.publicKey) {
        setLoading(true);
        try {
          const stakeAccountInfo = await solanaService.getStakeAccountInfos(wallet.publicKey);
          console.log(printJson(stakeAccountInfo));
          setStakeAccountInfos(stakeAccountInfo);
          stake.setStakeAccountInfos(stakeAccountInfo);
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      }
    };
    asyncCall();
  });

  return (
    <div className={classes.root}>
      <div className={classes.navigation}>
        <Link to={`/`}>
          <Button>Back</Button>
        </Link>
        {!isLoading && (
          <Link to={`/${ROUTE.VALIDATORS}`}>
            <Button>Add</Button>
          </Link>
        )}
      </div>
      <div className={classes.content}>
        {isLoading ? (
          <Loader size={40} />
        ) : (
          <>
            {stakeAccountInfos.map((info) => (
              <Button key={uid(info)} onClick={() => setStakeAccount(info)}>
                {info.stakeAccount} - {info.status} - {printSol(info.activeStake)} -{" "}
                {printSol(info.lamports)}
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
}
