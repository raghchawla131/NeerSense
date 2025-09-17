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

const NeerBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Add user message
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    // Show loading overlay
    setLoading(true);

    // Hardcoded 15s fake processing
    setTimeout(() => {
      setLoading(false);
      const botMessage = { text: `You said: "${input}"`, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    }, 15000);

    setInput("");
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
      {loading && <LoadingOverlay />}

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
