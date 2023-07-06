import * as _ from "lodash";
import { Button, ButtonProps, Typography } from "@mui/material";
import { useDerivationPathButtonStyles } from "./useDerivationPathButtonStyles";
import { LedgerHDWalletAccount, printSol, truncateAddres } from "@/utils";
import { useMemo } from "react";
import { StatusFetching } from "@/stores";
import { Loader } from "@/components";

interface DerivationPathButton extends ButtonProps {
  caption: string;
  accounts: LedgerHDWalletAccount[] | undefined;
  fetchStatus: StatusFetching;
  hideNullBalance?: boolean;
}

export const DerivationPathButton = ({
  caption,
  accounts,
  fetchStatus,
  hideNullBalance,
  ...rest
}: DerivationPathButton) => {
  const { classes } = useDerivationPathButtonStyles();

  const isReady = accounts && accounts.length > 0;

  const activeAccounts = useMemo(
    () => (isReady ? accounts.filter((account) => account?.balance !== undefined) : []),
    [isReady, accounts],
  );

  const activeAddress = useMemo(
    () =>
      activeAccounts.length > 0
        ? activeAccounts[0].publicKey?.toBase58()
        : isReady
          ? accounts[0].publicKey.toBase58()
          : "",
    [activeAccounts, accounts],
  );
  const balance = useMemo(
    () => (isReady ? _.sumBy(accounts, (item) => item.balance ?? 0) : 0),
    [isReady, accounts],
  );

  if (!(accounts && accounts.length > 0 && (!hideNullBalance || hideNullBalance && activeAccounts.length > 0))) {
    return null;
  }

  return (
    <Button className={classes.root} {...rest}>
      {fetchStatus === "fetching" && <Loader className={classes.loader} />}
      <div className={classes.panel}>
        <Typography variant="h5">{caption}</Typography>
        <Typography>{truncateAddres(activeAddress)}</Typography>
      </div>
      <div className={classes.panel}>
        <Typography variant="h5">{printSol(balance)}</Typography>
        <Typography>{`${activeAccounts.length} accounts`}</Typography>
      </div>
    </Button>
  );
};
