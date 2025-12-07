const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// In-memory risk scoring logic (mocked for now, can be moved to separate file)
const calculateRiskScore = (worker) => {
    let score = 20; // Base score
    if (!worker.incidents) return score;

    // Mock logic: +30 for serious, +20 for >3 minor
    // This will be refined.
    return score;
};

module.exports = { prisma, calculateRiskScore };
