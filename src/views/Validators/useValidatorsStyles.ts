import { makeStyles } from "tss-react/mui";

export const useValidatorsStyles = makeStyles()(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
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
