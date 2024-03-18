/**
 * This is a dummy server to simulate an endpoint to send data to from the frontend.
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());

// POST endpoint to get an AI-driven form config
app.post('/dummy', async (req, res) => {
    res.send({ test: true })
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/dummy`);
});