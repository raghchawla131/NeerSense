import React from "react";
import { AppBar, Box, Container, IconButton, Toolbar, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "linear-gradient(180deg,#0b0f1a 0%, #0f1115 100%)", color: "#e6e9ef" }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "#0f1320", borderBottom: "1px solid #1d2433" }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700 }}>NeerSense</Typography>
          <IconButton color="inherit" onClick={() => navigate("/neerbot")}>
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default DashboardLayout;


