import { makeStyles } from "tss-react/mui";

const MARGIN = 30;

export const useModalsStyles = makeStyles()((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    // height: `calc(100vh - ${2 * MARGIN}px)`,
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
}));
