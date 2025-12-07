const express = require('express');
const router = express.Router();
const { prisma } = require('../db');

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Simple check (in production use hashing!)
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ user });
});

// Register (for demo setup)
router.post('/register', async (req, res) => {
    const { name, email, password, role, agency } = req.body;
    try {
        const user = await prisma.user.create({
            data: { name, email, password, role, agency }
        });
        res.json({ user });
    } catch (e) {
        res.status(400).json({ error: 'User already exists' });
    }
});

module.exports = router;
