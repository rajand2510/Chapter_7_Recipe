require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');

const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/recipes/:id/comments', require('./routes/commentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use("/api/email", require("./routes/emailRoutes"));

// Error handling middleware
app.use(errorHandler);

// Create HTTP server and wrap Express app
const server = http.createServer(app);

// Setup Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*', // or your frontend origin
  },
});

// Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new Error("Authentication error"));
    socket.userId = user.id;
    next();
  });
});

const connectedUsers = new Map();

io.on('connection', (socket) => {
  if (!connectedUsers.has(socket.userId)) {
    connectedUsers.set(socket.userId, new Set());
  }
  connectedUsers.get(socket.userId).add(socket.id);
  console.log(`User connected: ${socket.userId}`);

  socket.on('disconnect', () => {
    const userSockets = connectedUsers.get(socket.userId);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) connectedUsers.delete(socket.userId);
    }
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Export io and connectedUsers for use in controllers
module.exports = { io, connectedUsers };

// Start server with http server (instead of app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
