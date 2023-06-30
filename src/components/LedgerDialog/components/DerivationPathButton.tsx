import { Button, ButtonProps, Typography } from "@mui/material";
import { useDerivationPathButtonStyles } from "./useDerivationPathButtonStyles";
import { LedgerHDWalletAccount, truncateAddres } from "@/utils";
import { useMemo } from "react";
import { useInitEffect } from "@/hooks";
import { StatusFetching } from "@/stores";
import { Loader } from "@/components";

interface DerivationPathButton extends ButtonProps {
  caption: string;
  accounts: LedgerHDWalletAccount[] | undefined;
	fetchStatus: StatusFetching;
  fetchBalance: () => void;
}

export const DerivationPathButton = ({ caption, accounts, fetchStatus, fetchBalance, ...rest }: DerivationPathButton) => {
  const { classes } = useDerivationPathButtonStyles();

  const address = useMemo(() => accounts ? accounts[0].publicKey?.toBase58() : "", [accounts]);

  useInitEffect(() => {
    fetchBalance();
  })

  const balance = "0.3 SOL";

  if (!accounts) {
    return null;
  }

	console.log(888, fetchStatus);

	if (fetchStatus === "fetching") {
		return <Loader />;
	}

  return (
    <Button className={classes.root} {...rest}>
      <div className={classes.panel}>
        <Typography variant="h5">{caption}</Typography>
        <Typography>{truncateAddres(address)}</Typography>
      </div>
      <div className={classes.panel}>
        <Typography variant="h5">{balance}</Typography>
        <Typography>{`${accounts.length} accounts`}</Typography>
      </div>
    </Button>
  );
};
