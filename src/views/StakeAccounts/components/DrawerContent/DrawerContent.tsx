import { Button, Typography } from "@mui/material";
import { useDrawerContentStyles } from "./useDrawerContentStyles";
import { StakeAccount } from "@/services";
import { useMemo, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { printValue } from "@/utils";
import { observer } from "mobx-react-lite";
import { useStores } from "@/hooks";
import { Loader } from "@/components";

interface DrawerContentProps {
  stakeAccount: StakeAccount;
  onClose: () => void;
}

export const DrawerContent = observer(({ stakeAccount, onClose }: DrawerContentProps) => {
  const { classes } = useDrawerContentStyles();
  const { staking, txModals } = useStores();
  const { isAction } = staking;
  const { connection } = useConnection();
  const wallet = useWallet();

  const isDeactivateStake = useMemo(
    () => ["active", "activating"].includes(stakeAccount.status),
    [stakeAccount],
  );
  const isWithdrawStake = useMemo(() => ["inactive"].includes(stakeAccount.status), [stakeAccount]);

  const handleDeactivateStake = useCallback(async () => {
    txModals.openModal("to deactivate stake");
    const signature = await staking.deactivateStake(wallet, connection, stakeAccount);
    txModals.showTx(signature, () => {
      wallet.publicKey && staking.fetchStakeAccountInfos(wallet.publicKey);
      onClose();
    });
  }, [staking, connection, stakeAccount, wallet]);

  const handleWithdrawStake = useCallback(async () => {
    txModals.openModal("to withdraw stake");
    const signature = await staking.withdrawStake(wallet, connection, stakeAccount);
    txModals.showTx(signature, () => {
      wallet.publicKey && staking.fetchStakeAccountInfos(wallet.publicKey);
      onClose();
    });
  }, [connection, stakeAccount, wallet]);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Typography variant="h6">Status: {stakeAccount.status}</Typography>
        <Typography variant="h6">Address: {stakeAccount.stakeAccount}</Typography>
        <Typography variant="h6">Balance: {printValue(stakeAccount.lamports)} SOL</Typography>
      </div>
      <div className={classes.navigation}>
        <Button onClick={onClose}>Back</Button>
        {isDeactivateStake && (
          <Button onClick={handleDeactivateStake}>
            {isAction && <Loader size={25} />} Deactivate stake
          </Button>
        )}
        {isWithdrawStake && (
          <Button onClick={handleWithdrawStake}>
            {isAction && <Loader size={25} />} Withdraw stake
          </Button>
        )}
      </div>
    </div>
  );
});
