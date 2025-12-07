const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const workerRoutes = require('./routes/workers');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/workers', workerRoutes);

// Health check
app.get('/health', (req, res) => res.send('OK'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
