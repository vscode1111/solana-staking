import { makeStyles } from "tss-react/mui";

export const useLedgerDialogStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  back: {
    width: "100%",
    backgroundColor: theme.colors.violet,
  },
  button: {
    justifyContent: "space-between",
    width: "100%",
  },
}));
