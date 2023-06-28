import { FC, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "../../assets/bg.png";
import Typography from "@mui/material/Typography";
import "./Navbar.css";
import { Content } from "../WalletConnection/WalletConnection";

export const NavAppBar: FC = (props) => {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar className="Appbar" position="static">
          <Content />
        </AppBar>
      </Box>
    </div>
  );
};
