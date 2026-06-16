import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import notificationRoutes from './routes/notificationRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api', notificationRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(errorHandler); // Centralized error handling

// Database connection (simplified)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notification-db')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

export default app; // For testing
