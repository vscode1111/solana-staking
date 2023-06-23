import { createTheme } from "@mui/material/styles";
import { COLORS, TRANSITION } from "@consts";
import { globalStyles } from "./globalStyles";

const baseTheme = createTheme({
  colors: COLORS,
  typography: {
    fontFamily: [
      "Galano Grotesque",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    allVariants: {
      color: COLORS.white,
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 820,
      lg: 1440,
      xl: 1920,
    },
  },
});

export const theme = createTheme(baseTheme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: globalStyles,
    },

    MuiTypography: {
      styleOverrides: {
        h1: {
          fontWeight: 500,
          fontSize: 70,
          lineHeight: "84px",
        },
        h2: {
          fontWeight: 500,
          fontSize: 50,
          lineHeight: "60px",
        },
        h3: {
          fontWeight: 500,
          fontSize: 34,
          lineHeight: "48px",
        },
        h4: {
          fontWeight: 500,
          fontSize: 22,
          lineHeight: "40px",
        },
        h5: {
          fontWeight: 500,
          fontSize: 18,
          lineHeight: "18px",
        },
        h6: {
          fontWeight: 500,
          fontSize: 16,
          lineHeight: "19.2px",
        },
        subtitle1: {
          fontWeight: 500,
          fontSize: 14,
          lineHeight: "16.8px",
        },
        body1: {
          fontWeight: 300,
          fontSize: 16,
          lineHeight: "28.8px",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          display: "flex",
          gap: "12px",
          width: 200,
          fontSize: 12,
          fontWeight: 600,
          backgroundColor: COLORS.red,
          color: COLORS.white,
          textTransform: "initial",
          transition: TRANSITION,
          border: "1px solid transparent",
          borderRadius: 8,
          padding: "20px 12px",
          "& > span": {
            marginTop: 3,
          },
          "&:hover": {
            // backgroundColor: COLORS.white,
            borderColor: COLORS.violet,
          },
          "&:disabled": {
            color: COLORS.white,
            opacity: 0.3,
            backgroundColor: "transparent",
          },
        },

        text: {
          backgroundColor: "transparent",
          width: "fit-content",
          borderBottom: `1px solid ${COLORS.black}`,
          "&&": {
            height: 28,
          },
          "&:disabled": {
            borderBottom: `1px solid transparent`,
          },
        },

        outlined: {
          backgroundColor: "transparent",
          color: COLORS.black,
          borderBottom: `1px solid ${COLORS.black}`,
          "&:hover": {
            opacity: 1,
            color: COLORS.red,
            border: "unset",
            borderBottom: `1px solid ${COLORS.red2}`,
            "& > svg": {
              color: COLORS.black,
            },
          },
          "&:disabled": {
            opacity: 1,
            backgroundColor: "transparent",
          },
        },

        sizeSmall: {
          fontSize: 13,
          height: 32,
          width: 32,
          minWidth: 32,
        },

        sizeMedium: {
          fontSize: 16,
          height: 54,
        },

        sizeLarge: {
          fontSize: 16,
          height: 50,
        },
      },

      variants: [
        {
          props: { size: "tiny" },
          style: {
            fontSize: 14,
            borderRadius: 20,
            paddingTop: 7,
            paddingBottom: 7,
            paddingLeft: 14,
            paddingRight: 14,
            height: 28,
            minWidth: 80,
          },
        },
      ],
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          padding: "4px 0 12px",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: "100%",
          color: COLORS.white,
          backgroundColor: COLORS.black,
        },
      },
    },
  },
});
