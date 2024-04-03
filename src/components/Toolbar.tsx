import * as React from "react";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import MapComponentsLogo from "../../public/mapcomponents_logo.png";
import WhereGroupLogo from "../../public/WhereGroup-Logo-quer-rgb.png";

export interface TopToolbarProps {
  children?: React.ReactNode;
  unmovableButtons?: React.ReactNode;
  buttons?: React.ReactNode;
  logo?: React.ReactNode;
}

function TopToolbar(props: TopToolbarProps) {
  const theme = useTheme();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      sx={{
        minHeight: "62px",
        position: "absolute",
        zIndex: 1300,
        top: 0,
      }}
    >
      <Toolbar disableGutters>
        {props.logo || (
          <>
            <Box
              sx={{
                marginLeft: "25px",
                display: { xs: "none", md: "flex" },
                flexGrow: { md: "30" },
              }}
            >
              <img
                src={
                  theme.palette.mode === "dark"
                    ? MapComponentsLogo
                    : MapComponentsLogo
                }
                style={{ width: "100%", maxWidth: "50px" }}
              />
              <img
                src={
                  theme.palette.mode === "dark"
                    ? WhereGroupLogo
                    : WhereGroupLogo
                }
                style={{ width: "100%", maxWidth: "50px" }}
              />
            </Box>
            <Box
              sx={{
                margin: "10px",
                display: { xs: "flex", sm: "flex", md: "none" },
                flexGrow: { xs: "500" },
                mr: { sm: "0px" },
              }}
            >
              <img src={MapComponentsLogo} width="auto" height="50px" />
              <img src={WhereGroupLogo} width="auto" height="50px" />
            </Box>
          </>
        )}
        <Box sx={{ flexGrow: 1, display: { xs: "flex" } }}>
          {props.unmovableButtons}
        </Box>
        {props.buttons ? (
          <Box sx={{ flexGrow: 22, display: { xs: "flex", sm: "none" } }}>
            <IconButton onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              PaperProps={{
                elevation: 24,
                sx: {
                  overflow: "visible",
                  mt: "15px",
                },
              }}
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <Box
                sx={{ paddingLeft: "10px", paddingRight: "10px" }}
                onClick={handleCloseNavMenu}
              >
                {props.buttons}
              </Box>
            </Menu>
          </Box>
        ) : (
          ""
        )}
        <Box sx={{ marginRight: "25px", display: { xs: "none", sm: "flex" } }}>
          {props.buttons}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopToolbar;
