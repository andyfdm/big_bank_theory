import React, { useState } from 'react';
import {
  Card,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import './Chatbot.css';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! 👋 I\'m FDM Bank\'s support assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock chatbot responses
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('balance') || message.includes('account')) {
      return 'You can view your account balances in the Accounts section of your dashboard. Would you like help with anything else?';
    } else if (message.includes('transfer') || message.includes('transaction')) {
      return 'To make a transfer, click on "Transfer between accounts" or "Pay via account" in the Pay Actions section. You\'ll need to enter the recipient details and amount.';
    } else if (message.includes('suspicious') || message.includes('fraud') || message.includes('alert')) {
      return 'If you notice any suspicious activity, please contact us immediately. We monitor transactions 24/7 for your security. All alerts are shown in your Security Alerts section.';
    } else if (message.includes('2fa') || message.includes('two factor') || message.includes('security')) {
      return 'Your account is protected with Two-Factor Authentication (2FA). This adds an extra layer of security to your account. For any security concerns, contact our support team.';
    } else if (message.includes('help') || message.includes('support')) {
      return 'I can help you with information about accounts, transfers, security, alerts, and more. What would you like to know?';
    } else if (message.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can assist you with?';
    }
    return 'I\'m here to help! You can ask me about your accounts, transfers, security, or any banking-related questions. What would you like to know?';
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 500);
  };

  if (!isOpen) {
    return (
      <Box className="chatbot-fab">
        <Button
          variant="contained"
          color="primary"
          startIcon={<SmartToyIcon />}
          onClick={() => setIsOpen(true)}
          sx={{
            borderRadius: '50px',
            padding: '12px 24px',
            textTransform: 'none'
          }}
        >
          Support Chat
        </Button>
      </Box>
    );
  }

  return (
    <Card className="chatbot-container">
      <Box className="chatbot-header">
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon /> FDM Support
        </Typography>
        <IconButton
          size="small"
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box className="chatbot-messages">
        {messages.map((message) => (
          <Paper
            key={message.id}
            className={`chatbot-message ${message.sender}`}
            sx={{
              p: 2,
              mb: 1,
              backgroundColor: message.sender === 'user' ? '#667eea' : '#f5f5f5',
              color: message.sender === 'user' ? 'white' : 'black',
              marginLeft: message.sender === 'user' ? 'auto' : '0',
              marginRight: message.sender === 'bot' ? 'auto' : '0',
              maxWidth: '80%',
              borderRadius: '8px'
            }}
          >
            <Typography variant="body2">{message.text}</Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                marginTop: '4px',
                opacity: 0.7
              }}
            >
              {message.timestamp.toLocaleTimeString()}
            </Typography>
          </Paper>
        ))}
        {loading && (
          <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2">Typing...</Typography>
          </Paper>
        )}
      </Box>

      <Box component="form" onSubmit={handleSendMessage} className="chatbot-input">
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          variant="outlined"
          size="small"
          sx={{ mr: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !input.trim()}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Card>
  );
}

export default Chatbot;
