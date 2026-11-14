require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const initStandupCron = require('./jobs/standupCron');

const app = express();
app.use(express.json());

// Middleware: Allow local dev AND your deployed Vercel frontend
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL // e.g., https://standup-ai.vercel.app (no trailing slash)
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Health check route (useful for keeping Render awake)
app.get('/', (req, res) => {
    res.send('StandupAI API is running');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/config', require('./routes/configRoutes'));

// Database & Server Start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            initStandupCron();
            console.log('⚡ Standup Cron Scheduler initialized and running.');
        });
    })
    .catch(err => console.error('MongoDB Connection Error:', err));