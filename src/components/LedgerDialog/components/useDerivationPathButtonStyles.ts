import { makeStyles } from "tss-react/mui";

export const useDerivationPathButtonStyles = makeStyles()(() => ({
  root: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    "&&": {
      height: 80,
    },
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));
