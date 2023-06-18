import { Colors } from "@consts";

declare module "@mui/material/styles" {
  interface Theme {
    colors: Colors;
  }

  interface ThemeOptions {
    colors: Colors;
  }
}
