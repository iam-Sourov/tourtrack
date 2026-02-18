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

// Routes
app.post('/api/itinerary', (req, res) => {
    const { destination, vibes, freeTime } = req.body;

    // Path to Python script
    const scriptPath = path.join(__dirname, '../ai_service/main.py');

    // Spawn Python process
    const pythonProcess = spawn('python', [scriptPath, JSON.stringify({ destination, vibes, freeTime })]);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Failed to generate itinerary' });
        }
        try {
            const result = JSON.parse(dataString);
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
