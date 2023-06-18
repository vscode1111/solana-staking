import { makeStyles } from "tss-react/mui";

export const useHomeStyles = makeStyles()(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "fit-content",
    height: 25,
    padding: "3px 12px 8px",
    borderRadius: 8,
  },
}));
