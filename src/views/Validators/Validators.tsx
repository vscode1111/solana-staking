import { Link } from "react-router-dom";
import { useValidatorsStyles } from "./useValidatorsStyles";
import { ROUTE } from "@/consts";
import { Button, Typography } from "@mui/material";
import { Loader } from "@/components";
import { uid } from "react-uid";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { printValue } from "@/utils";
import { useInitWalletEffect, useStores } from "@/hooks";
import { observer } from "mobx-react-lite";

export const Validators = observer(() => {
  const { classes } = useValidatorsStyles();

  const { connection } = useConnection();
  const wallet = useWallet();
  const { staking, txModals } = useStores();
  const { stakeAccountInfos, validators, isFetching } = staking;

  useInitWalletEffect(() => {
    staking.fetchValidators();
  });

  const handleClick = async (votePubkey: string) => {
    if (wallet && wallet.publicKey) {
      txModals.openModal("to delegate stake");
      const stakeAccount = Keypair.generate();
      let signature = await staking.delegateStake(wallet, connection, stakeAccount, votePubkey);

      await txModals.showTx(signature, () => {
        staking.fetchValidators();
      });

      const foundStakeAccountInfo = stakeAccountInfos.find(
        (info) => info.validator === votePubkey && info.status.toLowerCase() === "activating",
      );

      if (!foundStakeAccountInfo) {
        return;
      }

      txModals.openModal("to merge stake");
      signature = await staking.mergeStake(wallet, connection, stakeAccount, foundStakeAccountInfo);
      txModals._showTx(signature, () => staking.fetchValidators());

      // if (!SEPARATE_TX) {
      //   if (foundStakeAccountInfo) {
      //     transaction1.add(
      //       StakeProgram.merge({
      //         sourceStakePubKey: stakeAccount.publicKey,
      //         stakePubkey: new PublicKey(foundStakeAccountInfo.stakeAccount),
      //         authorizedPubkey: wallet.publicKey,
      //       }),
      //     );
      //   }
      // }
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.navigation}>
        <Link to={`/${ROUTE.STAKE_ACCOUNTS}`}>
          <Button>Back</Button>
        </Link>
        <Typography variant="h4">Validators</Typography>
        <div />
      </div>
      <div className={classes.content}>
        {isFetching ? (
          <Loader size={40} />
        ) : (
          <>
            {validators.map((info) => (
              <Button key={uid(info)} onClick={() => handleClick(info.votePubkey)}>
                {info.votePubkey} - {printValue(info.activatedStake)}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
});
