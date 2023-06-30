import { makeStyles } from "tss-react/mui";

export const useStakeAccountsStyles = makeStyles()(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    padding: 20,
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));
