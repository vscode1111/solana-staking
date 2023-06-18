import { Button } from "@mui/material";
import { useStakeAccountsStyles } from "./useStakeAccountsStyles";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { StakeAccount, solanaService } from "@services";
import { uid } from "react-uid";
import { Loader } from "@components";
import { ROUTE } from "@consts";
import { useWallet } from "@solana/wallet-adapter-react";

export function StakeAccounts() {
  const { classes } = useStakeAccountsStyles();
  const [stakeAccountInfos, setStakeAccountInfos] = useState<StakeAccount[]>([]);
  const [isLoading, setLoading] = useState(false);

  const wallet = useWallet();

  useEffect(() => {
    const asyncCall = async () => {
      if (wallet.connected && wallet.publicKey) {
        setLoading(true);
        try {
          const stakeAccountInfo = await solanaService.getStakeAccountInfos(wallet.publicKey);
          setStakeAccountInfos(stakeAccountInfo);
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      }
    };
    asyncCall();
  }, [wallet]);

  return (
    <div className={classes.root}>
      <div className={classes.navigation}>
        <Link to={`/`}>
          <Button>Back</Button>
        </Link>
        <Link to={`/${ROUTE.VALIDATORS}`}>
          <Button>Add</Button>
        </Link>
      </div>
      <div className={classes.content}>
        {isLoading ? (
          <Loader size={40} />
        ) : (
          <>
            {stakeAccountInfos.map((info) => (
              <Button key={uid(info)}>
                {info.stakeAccount} - {info.status} - {info.activeStake?.toFixed(3)}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
