import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paperRoutes from './routes/paper.js';
import exportRoutes from './routes/export.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/paper', paperRoutes);
app.use('/api/export', exportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AI Research Paper Assistant API',
    time: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Research Paper Assistant Backend is running on port ${PORT}`);
  console.log(`📡 Health Check:https://github-resarch-paper-assistant.onrender.com/api/health`);
  console.log(`🔑 Gemini Key Status: ${process.env.GEMINI_API_KEY ? 'Active' : 'Fallback Academic Engine Enabled'}`);
  console.log(`====================================================`);
});
