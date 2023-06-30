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
  back: {
    width: "100%",
  },
  button: {
    justifyContent: "space-between",
    width: "100%",
  },
}));
