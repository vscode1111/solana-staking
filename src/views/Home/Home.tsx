import { MyWallet } from "@/components";
import { useHomeStyles } from "./useHomeStyles";
import { observer } from "mobx-react";

export const Home = observer(() => {
  const { classes } = useHomeStyles();

  return (
    <div className={classes.root}>
      <MyWallet />
    </div>
  );
});
