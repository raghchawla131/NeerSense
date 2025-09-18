import React from "react";
import { Box, Typography } from "@mui/material";

const Panel = ({ title, actions, children, sx }) => {
  return (
    <Box sx={{
      bgcolor: "#151923",
      border: "1px solid #222a3a",
      borderRadius: 3,
      p: 3,
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      ...sx,
    }}>
      {(title || actions) && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Box>{actions}</Box>
        </Box>
      )}
      {children}
    </Box>
  );
};

export default Panel;


