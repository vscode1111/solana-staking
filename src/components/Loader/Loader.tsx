import { CircularProgress, CircularProgressProps } from "@mui/material";

interface LoaderProps extends CircularProgressProps {}

export function Loader(props: LoaderProps) {
  return <CircularProgress {...props} />;
}
