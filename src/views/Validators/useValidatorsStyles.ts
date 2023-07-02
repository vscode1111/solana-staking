import { makeStyles } from "tss-react/mui";

export const useValidatorsStyles = makeStyles()(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    padding: 20,
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
}));
