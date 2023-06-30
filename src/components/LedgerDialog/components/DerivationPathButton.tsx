import { Button, ButtonProps, Typography } from "@mui/material";
import { useDerivationPathButtonStyles } from "./useDerivationPathButtonStyles";
import { LedgerHDWalletAccount, truncateAddres } from "@/utils";
import { useMemo } from "react";

interface DerivationPathButton extends ButtonProps {
  caption: string;
  accounts: LedgerHDWalletAccount[];
}

export const DerivationPathButton = ({ caption, accounts, ...rest }: DerivationPathButton) => {
  const { classes } = useDerivationPathButtonStyles();

  const address = useMemo(() => accounts[0].publicKey?.toBase58(), [accounts]);

  const balance = "0.3 SOL";

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
