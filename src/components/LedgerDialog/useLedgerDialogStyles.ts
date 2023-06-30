import { makeStyles } from "tss-react/mui";

export const useLedgerDialogStyles = makeStyles()(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  button: {
    width: "100%",
  },
}));
