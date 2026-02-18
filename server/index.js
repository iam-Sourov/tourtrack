const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tourTrack')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.warn('MongoDB connection failed (Functionality Limited):', err.message));

// Simple in-memory cache
const itineraryCache = new Map();

// Routes
app.post('/api/itinerary', (req, res) => {
    const { destination, vibes, freeTime } = req.body;

    // Create a standardized cache key
    const cacheKey = `${destination?.toLowerCase()}-${vibes?.toLowerCase()}-${freeTime?.toLowerCase()}`;

    if (itineraryCache.has(cacheKey)) {
        console.log(`Serving cached result for: ${cacheKey}`);
        return res.json(itineraryCache.get(cacheKey));
    }

    // Path to Python script
    const scriptPath = path.join(__dirname, '../ai_service/main.py');

    // Spawn Python process with explicit UTF-8 encoding environment
    const pythonProcess = spawn('python',
        [scriptPath, JSON.stringify({ destination, vibes, freeTime })],
        { env: { ...process.env, PYTHONIOENCODING: 'utf-8' } }
    );

    let dataChunks = [];

    pythonProcess.stdout.on('data', (data) => {
        dataChunks.push(data);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Failed to generate itinerary' });
        }

        const dataString = Buffer.concat(dataChunks).toString(); // Safe for multi-byte chars

        try {
            const result = JSON.parse(dataString);

            // Cache the successful result
            if (!result.error) {
                itineraryCache.set(cacheKey, result);
            }

            res.json(result);
        } catch (e) {
            console.error('JSON Parse Error:', dataString); // Log raw output for debugging
            res.status(500).json({ error: 'Invalid response from AI service', details: dataString });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
