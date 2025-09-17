import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import WavesIcon from "@mui/icons-material/Waves";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature"; // fixed

const ArgoDashboard = () => {
  // Dummy metrics
  const metrics = [
    { label: "Temperature", value: "23.5°C", icon: <ThermostatIcon sx={{ fontSize: 40, color: "#00bcd4" }} /> },
    { label: "Salinity", value: "35 PSU", icon: <OpacityIcon sx={{ fontSize: 40, color: "#00bcd4" }} /> },
    { label: "Depth", value: "1500 m", icon: <WavesIcon sx={{ fontSize: 40, color: "#00bcd4" }} /> },
    { label: "Plankton Density", value: "200 cells/mL", icon: <EmojiNatureIcon sx={{ fontSize: 40, color: "#00bcd4" }} /> },
  ];

  // Dummy chart data
  const tempData = [
    { depth: 0, temp: 25 },
    { depth: 200, temp: 24 },
    { depth: 400, temp: 23 },
    { depth: 600, temp: 22 },
    { depth: 800, temp: 21 },
    { depth: 1000, temp: 20 },
    { depth: 1200, temp: 19 },
    { depth: 1400, temp: 18 },
    { depth: 1500, temp: 17.5 },
  ];

  const salinityData = tempData.map((d) => ({ depth: d.depth, salinity: 35 + Math.random() }));

  const planktonData = [
    { type: "Diatoms", density: 80 },
    { type: "Dinoflagellates", density: 50 },
    { type: "Coccolithophores", density: 30 },
    { type: "Other", density: 40 },
  ];

  const seabedData = [
    { distance: 0, depth: 1500 },
    { distance: 50, depth: 1550 },
    { distance: 100, depth: 1600 },
    { distance: 150, depth: 1580 },
    { distance: 200, depth: 1620 },
    { distance: 250, depth: 1590 },
    { distance: 300, depth: 1600 },
  ];

  return (
    <Box sx={{ bgcolor: "#121212", minHeight: "100vh", py: 6, color: "#fff" }}>
      <Container maxWidth="lg">
        {/* Title */}
        <Typography variant="h3" sx={{ mb: 4, textAlign: "center" }}>
          ARGO Dashboard
        </Typography>

        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {metrics.map((m, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 3,
                  bgcolor: "#1e1e1e",
                }}
                elevation={3}
              >
                {m.icon}
                <Typography variant="h6">{m.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {m.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4}>
          {/* Temperature Line Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#1e1e1e" }} elevation={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Temperature vs Depth
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={tempData}>
                  <CartesianGrid stroke="#444" />
                  <XAxis dataKey="depth" reversed label={{ value: "Depth (m)", position: "insideBottom", offset: -5 }} />
                  <YAxis label={{ value: "Temp (°C)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#00bcd4" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Salinity Line Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#1e1e1e" }} elevation={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Salinity vs Depth
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salinityData}>
                  <CartesianGrid stroke="#444" />
                  <XAxis dataKey="depth" reversed label={{ value: "Depth (m)", position: "insideBottom", offset: -5 }} />
                  <YAxis label={{ value: "Salinity (PSU)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="salinity" stroke="#4caf50" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Plankton Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#1e1e1e" }} elevation={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Plankton Density
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={planktonData}>
                  <CartesianGrid stroke="#444" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="density" fill="#00bcd4" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Seafloor Area Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "#1e1e1e" }} elevation={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Seafloor Topography
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={seabedData}>
                  <CartesianGrid stroke="#444" />
                  <XAxis dataKey="distance" label={{ value: "Distance (km)", position: "insideBottom", offset: -5 }} />
                  <YAxis label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="depth" stroke="#00bcd4" fill="#00bcd455" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ArgoDashboard;
