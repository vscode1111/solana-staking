import { MyWallet } from "@/components";
import { useHomeStyles } from "./useHomeStyles";
import { useStores } from "@/hooks";
import { observer } from "mobx-react";
import { Button, Typography } from "@mui/material";

export const Home = observer(() => {
  const { classes } = useHomeStyles();
  const { list } = useStores();

  console.log(111, "hone", list.isFetching);

  return (
    <div className={classes.root}>
      <Typography>
        {list.step} - {list.isFetching}
      </Typography>
      <Button
        onClick={() => {
          list.setStep();
        }}
      >
        Step
      </Button>
      <Button
        onClick={() => {
          list.incrementFetching();
        }}
      >
        incrementFetching
      </Button>
      <MyWallet />
    </div>
  );
});
