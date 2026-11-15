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