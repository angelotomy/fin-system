const path = require('path');
// Load env from repo root if present
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// Load env from server/ folder (overrides root values if both exist)
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');

// Import routes
const transactionRoutes = require('./routes/transactionRoutes');
const accountRoutes = require('./routes/accountRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Initialize express
const app = express();

// Connect to database
connectDB();

// CORS configuration
const corsOptions = {
  origin: [
    'https://fin-system-d4yy2nfl5-angelo-tomys-projects.vercel.app', // previous deployment
    'https://fin-system-f401kktrc-angelo-tomys-projects.vercel.app', // previous deployment
    'https://fin-system-r4tyje6yy-angelo-tomys-projects.vercel.app', // latest deployment
    'https://fin-system-ckyf6thi1-angelo-tomys-projects.vercel.app', // <-- NEW deployment
    'https://fin-system-r3i01dw5v-angelo-tomys-projects.vercel.app', // <-- NEW deployment
    process.env.FRONTEND_URL // optional, if set in env
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something broke!' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 