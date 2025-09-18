import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <Box
      sx={{
        bgcolor: "#121212",
        height: "100vh",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: "#121212", boxShadow: "none" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            NeerSense
          </Typography>
          <Button
            color="inherit"
            sx={{ fontWeight: "bold" }}
            component={RouterLink}
            to="/neerbot"
          >
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Argo: A New Era of Ocean Data
          </Typography>

          <Typography
            variant="h5"
            component="p"
            sx={{ mb: 4, color: "#bdbdbd" }}
          >
            Transforming complex data into simple, actionable knowledge.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Typography variant="body1" sx={{ maxWidth: "600px", mb: 4 }}>
            Our AI-powered conversational system for ARGO floats allows you to
            query, explore, and visualize vast oceanographic datasets using
            natural language. Bridge the gap between raw data and meaningful
            insights effortlessly.
          </Typography>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#007bff",
              color: "#fff",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: "50px",
              "&:hover": { bgcolor: "#0056b3" },
            }}
            component={RouterLink}
            to="/neerbot"
          >
            Start Chatting
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home;
