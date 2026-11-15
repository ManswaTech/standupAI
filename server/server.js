require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const initStandupCron = require('./jobs/standupCron');

const app = express();

// CORS Middleware: Allow local dev AND all Vercel deployment/preview URLs
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
            origin.startsWith('http://localhost:') ||
            origin.endsWith('.vercel.app') ||
            (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
        ) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check route (useful for keeping Render awake)
app.get('/', (req, res) => {
    res.send('StandupAI API is running');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/config', require('./routes/configRoutes'));

// Database & Server Start
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
    console.error('FATAL: MONGO_URI environment variable is missing!');
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
            initStandupCron();
            console.log('⚡ Standup Cron Scheduler initialized and running.');
        });
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    });