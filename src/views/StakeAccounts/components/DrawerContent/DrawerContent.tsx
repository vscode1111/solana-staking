import { Button, Typography } from "@mui/material";
import { useDrawerContentStyles } from "./useDrawerContentStyles";
import { StakeAccount } from "@/services";
import { useMemo, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, StakeProgram, Transaction } from "@solana/web3.js";
import { printValue } from "@/utils";

interface DrawerContentProps {
  stakeAccount: StakeAccount;
  onClose: () => void;
}

export function DrawerContent({ stakeAccount, onClose }: DrawerContentProps) {
  const { classes } = useDrawerContentStyles();
  const { connection } = useConnection();
  const wallet = useWallet();
  console.log(111, stakeAccount);

  const isDeactivateStake = useMemo(
    () => ["active", "activating"].includes(stakeAccount.status),
    [stakeAccount],
  );
  const isWithdrawStake = useMemo(() => ["inactive"].includes(stakeAccount.status), [stakeAccount]);

  const handleDeactivateStake = useCallback(async () => {
    if (!wallet.publicKey) {
      return;
    }

    const transaction1 = new Transaction();

    transaction1.add(
      StakeProgram.deactivate({
        stakePubkey: new PublicKey(stakeAccount.stakeAccount),
        authorizedPubkey: wallet.publicKey,
      }),
    );

    const signature1 = await wallet.sendTransaction(transaction1, connection);
    console.log(777, signature1);
  }, [connection, stakeAccount, wallet]);

  const handleWithdrawStake = useCallback(async () => {
    if (!wallet.publicKey) {
      return;
    }

    const transaction1 = new Transaction();

    transaction1.add(
      StakeProgram.withdraw({
        stakePubkey: new PublicKey(stakeAccount.stakeAccount),
        authorizedPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey,
        lamports: stakeAccount.lamports,
      }),
    );

    const signature1 = await wallet.sendTransaction(transaction1, connection);
    console.log(777, signature1, stakeAccount.lamports);
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
        {isDeactivateStake && <Button onClick={handleDeactivateStake}>Deactivate stake</Button>}
        {isWithdrawStake && <Button onClick={handleWithdrawStake}>Withdraw stake</Button>}
      </div>
    </div>
  );
}
