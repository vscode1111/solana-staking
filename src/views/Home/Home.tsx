import { MyWallet } from "@components";
import { useHomeStyles } from "./useHomeStyles";

export function Home() {
  const { classes } = useHomeStyles();

  return (
    <div className={classes.root}>
      {/* <Connect2Phantom /> */}
      {/* <WalletMultiButton /> */}
      <MyWallet />
    </div>
  );
}
