import React from "react";
import { Box, Typography } from "@mui/material";

const MetricCard = ({ icon, label, value, accent = "#3dd6d0" }) => {
  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      p: 2.5,
      borderRadius: 3,
      bgcolor: "#131722",
      border: `1px solid rgba(61,214,208,0.15)`,
      boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
    }}>
      <Box sx={{ color: accent, display: "grid", placeItems: "center" }}>{icon}</Box>
      <Box>
        <Typography variant="body2" sx={{ color: "#9fb0c9" }}>{label}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
      </Box>
    </Box>
  );
};

export default MetricCard;


