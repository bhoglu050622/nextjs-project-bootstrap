const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"]
  }
});

// Store active connections
const connections = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('call-signal', ({ signal, phoneNumber }) => {
    // In a real implementation, this would connect to a VoIP service
    console.log('Call signal received for:', phoneNumber);
    
    // Echo back the signal for testing
    socket.emit('call-signal', signal);

    // Simulate transcription
    const transcriptionInterval = setInterval(() => {
      socket.emit('transcript', 'This is a simulated transcription of the call...');
    }, 2000);

    socket.on('disconnect', () => {
      clearInterval(transcriptionInterval);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connections.delete(socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
