import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initialOrders, initialB2BOrders, initialCustomers, initialDistributors, initialProducts } from './src/admin/mockData.js';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Single Source of Truth for Real-time Data
let globalState = {
  orders: [...initialOrders],
  b2bOrders: [...initialB2BOrders],
  customers: [...initialCustomers],
  distributors: [...initialDistributors],
  products: [...initialProducts]
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Immediately send the current state to the newly connected client
  socket.emit('SYNC_STATE', globalState);

  // Listen for state mutations from any client
  socket.on('UPDATE_STATE', ({ key, data }) => {
    if (globalState[key] !== undefined) {
      globalState[key] = data;
      // Broadcast the entire updated state to ALL OTHER connected clients
      socket.broadcast.emit('SYNC_STATE', globalState);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
