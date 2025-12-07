const express = require('express');
const router = express.Router();
const { prisma, calculateRiskScore } = require('../db');

// Search Workers
router.get('/search', async (req, res) => {
    const { phone, q } = req.query;
    // If phone provided, strict match. If q, fuzzy match on name or phone.

    if (!phone && !q) return res.json([]);

    const where = {};
    if (phone) where.phone = phone;
    else if (q) {
        console.log('Searching for:', q); // Debug log
        where.OR = [
            { name: { contains: q } },
            { phone: { contains: q } },
            { govId: { contains: q } },
            { id: { contains: q } }
        ];
    }

    const workers = await prisma.worker.findMany({
        where,
        include: { incidents: true }
    });

    res.json(workers);
});

// Get Worker by ID
// Also logs the access in AuditLog
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.query; // Passed from frontend for audit

    const worker = await prisma.worker.findUnique({
        where: { id },
        include: { incidents: true }
    });

    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    // Log access
    if (userId) {
        await prisma.auditLog.create({
            data: {
                workerId: id,
                userId: userId || 'unknown',
                action: 'VIEW_PROFILE'
            }
        });
    }

    res.json(worker);
});

// Create Worker (Admin)
router.post('/', async (req, res) => {
    const data = req.body; // name, phone, employer, role, etc.
    try {
        const worker = await prisma.worker.create({
            data: {
                ...data,
                riskScore: 20, // Default start
                riskLevel: 'LOW'
            }
        });
        res.json(worker);
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: 'Creation failed' });
    }
});

module.exports = router;
