require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const { validateFormConfig } = require('./validator');
const { aiIsAvailable, getAiDrivenFormConfig } = require('./openai');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL;

// check if the BASE_URL environment variable is set
if (!process.env.BASE_URL || process.env.BASE_URL === '') {
    console.error('The BASE_URL environment variable is not set.');
    process.exit(1);
}

// read allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [BASE_URL];
console.log('Allowed origins:', allowedOrigins);

// CORS
app.use(cors({
    origin: function (origin, callback) {
        if (!allowedOrigins.includes(origin)) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(msg, false);
        }
        return callback(null, true);
    }
}));

// Middleware
app.use(express.json());

// GET endpoint to check if AI is available
app.get('/ai', (req, res) => {
    res.json({ aiService: aiIsAvailable() });
});

// POST endpoint to get an AI-driven form config
app.post('/ai', async (req, res) => {
    try {
        if (!aiIsAvailable()) {
            res.status(500).send('The AI service is not available.');
            return;
        }

        const formConfig = await getAiDrivenFormConfig(req.body.usersPrompt);
        res.json({ formConfig });
    } catch (error) {
        res.status(500).send('Error getting the AI-driven form config. ' + error);
    }
});

// POST endpoint /config
app.post('/config', async (req, res) => {
    try {
        // Generate a unique ID for the config
        const id = uuidv4();
        const configPath = path.join(__dirname, 'configs', `${id}.json`);

        // Validate the config
        validateFormConfig(req.body);

        // Save the config as a JSON file
        await fs.writeFile(configPath, JSON.stringify(req.body, null, 2));

        // Respond with the URL
        res.json({ url: `${BASE_URL}/configs/${id}.json` });
    } catch (error) {
        res.status(500).send('Error saving the config. ' + error);
    }
});


app.use('/configs', express.static('configs')); // Serve configs statically


app.listen(PORT, () => {
    console.log(`Server running at ${BASE_URL}`);
});
