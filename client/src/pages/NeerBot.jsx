import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { motion } from 'framer-motion';

const NeerBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // User message
    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    // Mock bot response
    setTimeout(() => {
      const botMessage = { text: `You said: "${input}"`, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput('');
  };

  return (
    
    <Box
      sx={{
        bgcolor: '#121212',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
      }}
    >
      
      {/* Header tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: '300', color: '#fff', mb: 1 }}
          >
            Bridging the gap between you and the ocean's insights.
          </Typography>
        </Container>
      </motion.div>

      {/* Messages area */}
      <Container
        maxWidth="md"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 1.5,
                  maxWidth: '75%',
                  borderRadius: 3,
                  bgcolor: msg.sender === 'user' ? '#fff' : '#1e1e1e',
                  color: msg.sender === 'user' ? '#000' : '#fff',
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
            </Box>
          </motion.div>
        ))}
      </Container>

      {/* Input area */}
      <Box sx={{ position: 'sticky', bottom: 0, width: '100%', bgcolor: '#121212', py: 2 }}>
        <Container maxWidth="md">
          <Box
            component="form"
            onSubmit={handleSendMessage}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              sx={{
                bgcolor: '#1e1e1e',
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                input: { color: '#fff' },
                '& .MuiInputBase-input::placeholder': { color: '#999', opacity: 1 },
              }}
            />
            <IconButton
              type="submit"
              sx={{
                bgcolor: '#333',
                color: '#fff',
                '&:hover': { bgcolor: '#444' },
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
