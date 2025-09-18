import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";
import WaveText from "../components/WaveText";
import LoadingOverlay from "../components/LoadingOverlay";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext.jsx";

const NeerBot = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const navigate = useNavigate();
  const { setLastQuery, setNeerBotResult, setGeminiData } = useSearch();

  // const handleSendMessage = (e) => {
  //   e.preventDefault();
  //   if (input.trim() === "") return;

  //   // Show loading overlay
  //   setLoading(true);

  //   setInput("");
  // };

  const handleSendMessage = async (e) => {
  e.preventDefault();
  if (input.trim() === "") return;

  setLoading(true);       // Show loading overlay
  const userQuery = input;
  setInput("");           // Clear input

  try {
    const response = await fetch("http://localhost:5000/api/gemini/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: userQuery }),
    });

    const data = await response.json();

    console.log("Gemini response:", data);   // <-- Shows in Inspect → Console
    setGeminiResponse(data);                 // store it in state
    // Update shared context for dashboard
    setLastQuery(userQuery);
    setNeerBotResult({ source: "neerbot", text: data?.text || "", json: data?.json || null });
    setGeminiData(data);

  } catch (error) {
    console.error("Error sending query to backend:", error);
    setGeminiResponse({ error: error.message });
    setLastQuery(userQuery);
    setNeerBotResult({ source: "neerbot", error: error.message });
  } finally {
    // Do nothing here; LoadingOverlay.onComplete controls timing/navigation
  }
};

  return (
    <Box
      sx={{
        bgcolor: "#121212",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        py: 18,
      }}
    >
      {/* Show loading overlay when processing */}
      {loading && (
        <LoadingOverlay
          duration={15000} // 15 seconds change later
          onComplete={() => {
            setLoading(false);
            navigate("/argodetails"); // navigate after loading
          }}
        />
      )}

      {/* App Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Container
          maxWidth="md"
          sx={{ py: 0, display: "flex", justifyContent: "center" }}
        >
          <WaveText text="NeerSense" />
        </Container>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Container maxWidth="md" sx={{ py: 0 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "300", color: "#fff", mb: 0 }}
          >
            Bridging the gap between you and the ocean's insights.
          </Typography>
        </Container>
      </motion.div>

      {/* Input area */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          bgcolor: "#121212",
          mt: 22,
          py: 2,
        }}
      >
        <Container maxWidth="md">
          <Box
            component="form"
            onSubmit={handleSendMessage}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask NeerBot about the secrets of the ocean..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              sx={{
                bgcolor: "#1e1e1e",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                input: { color: "#fff" },
                "& .MuiInputBase-input::placeholder": {
                  color: "#999",
                  opacity: 1,
                },
              }}
            />
            <IconButton
              type="submit"
              sx={{
                bgcolor: "#333",
                color: "#fff",
                "&:hover": { bgcolor: "#444" },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default NeerBot;
