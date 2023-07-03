import { makeStyles } from "tss-react/mui";

const MARGIN = 30;

export const useTxModalsStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: `calc(100vh - ${2 * MARGIN}x)`,
    backgroundColor: theme.colors.gray0,
    margin: MARGIN,
    borderRadius: 20,
    padding: 30,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  close: {
    backgroundColor: theme.colors.red,
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
  txText: {
    display: "flex",
    gap: 15,
  },
}));
