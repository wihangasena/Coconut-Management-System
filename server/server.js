import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always resolve .env from the server directory, even when launched from another cwd.
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DB_URI;
  const fallbackUri = process.env.MONGODB_FALLBACK_URI || 'mongodb://127.0.0.1:27017/coconut_erp';

  if (!primaryUri) {
    console.error('MongoDB connection error: MONGODB_URI is not set in server/.env');
    process.exit(1);
  }

  try {
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB primary connection error:', error.message);

    // Atlas connectivity often fails in development when the client IP is not whitelisted.
    const atlasLikelyBlocked =
      typeof error.message === 'string' &&
      (error.message.includes('whitelist') || error.message.includes('Could not connect to any servers'));

    if (atlasLikelyBlocked) {
      try {
        console.warn(`Trying local MongoDB fallback: ${fallbackUri}`);
        await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB connected using local fallback');
      } catch (fallbackError) {
        console.error('MongoDB fallback connection error:', fallbackError.message);
        process.exit(1);
      }
      return;
    }

    process.exit(1);
  }
};

connectDB();

// Import routes
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import intakeRoutes from './routes/intake.js';
import productionRoutes from './routes/production.js';
import inventoryRoutes from './routes/inventory.js';
import salesRoutes from './routes/sales.js';
import qualityRoutes from './routes/quality.js';
import usersRoutes from './routes/users.js';
import settingsRoutes from './routes/settings.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/intake', intakeRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/quality', qualityRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Global error handler - must be last
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// Catch-all 404 handler
app.use((req, res) => {
  console.warn(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.path}`,
    status: 404
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
