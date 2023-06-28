import { makeStyles } from "tss-react/mui";

export const useLedgerDrawerContentStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 30,
    height: "100vh",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
  },
}));
