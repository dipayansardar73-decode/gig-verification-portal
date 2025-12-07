
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LOCATIONS = {
    DELHI: { lat: 28.6139, lng: 77.2090 },
    NOIDA: { lat: 28.5355, lng: 77.3910 },
    GURGAON: { lat: 28.4595, lng: 77.0266 },
    MUMBAI: { lat: 19.0760, lng: 72.8777 },
    BANGALORE: { lat: 12.9716, lng: 77.5946 },
    CONNAUGHT_PLACE: { lat: 28.6304, lng: 77.2177 },
    HAUZ_KHAS: { lat: 28.5494, lng: 77.2001 },
    LAJPAT_NAGAR: { lat: 28.5672, lng: 77.2433 },
    DWARKA: { lat: 28.5921, lng: 77.0460 },
    ROHINI: { lat: 28.7162, lng: 77.1170 }
};

const REAL_WORKERS = [
    // --- VERIFIED & SAFE ---
    { name: 'Amit Patel', phone: '9876500001', govId: '4532-8901-2345', employer: 'Zomato', role: 'DELIVERY', riskLevel: 'LOW', riskScore: 10, status: 'VERIFIED', location: LOCATIONS.CONNAUGHT_PLACE },
    { name: 'Priya Sharma', phone: '9876500002', govId: '8901-2345-6789', employer: 'Uber', role: 'RIDE', riskLevel: 'LOW', riskScore: 15, status: 'VERIFIED', location: LOCATIONS.HAUZ_KHAS },
    { name: 'Rahul Verma', phone: '9876500003', govId: '1234-5678-9012', employer: 'Swiggy', role: 'DELIVERY', riskLevel: 'LOW', riskScore: 12, status: 'VERIFIED', location: LOCATIONS.LAJPAT_NAGAR },
    { name: 'Sneha Gupta', phone: '9876500004', govId: '5678-9012-3456', employer: 'Urban Company', role: 'SERVICE', riskLevel: 'LOW', riskScore: 5, status: 'VERIFIED', location: LOCATIONS.DWARKA },
    { name: 'Vikram Singh', phone: '9876500005', govId: '9012-3456-7890', employer: 'Ola', role: 'RIDE', riskLevel: 'LOW', riskScore: 18, status: 'VERIFIED', location: LOCATIONS.ROHINI },
    { name: 'Anjali Das', phone: '9876500006', govId: '3456-7890-1234', employer: 'Blinkit', role: 'DELIVERY', riskLevel: 'LOW', riskScore: 8, status: 'VERIFIED', location: LOCATIONS.NOIDA },
    { name: 'Mohit Kumar', phone: '9876500007', govId: '7890-1234-5678', employer: 'Zepto', role: 'DELIVERY', riskLevel: 'LOW', riskScore: 22, status: 'VERIFIED', location: LOCATIONS.GURGAON },
    { name: 'Kavita Reddy', phone: '9876500008', govId: '2345-6789-0123', employer: 'Uber', role: 'RIDE', riskLevel: 'LOW', riskScore: 14, status: 'VERIFIED', location: LOCATIONS.DELHI },
    { name: 'Arjun Nair', phone: '9876500009', govId: '6789-0123-4567', employer: 'Porter', role: 'COURIER', riskLevel: 'LOW', riskScore: 11, status: 'VERIFIED', location: LOCATIONS.MUMBAI },
    { name: 'Riya Malhotra', phone: '9876500010', govId: '0123-4567-8901', employer: 'Zomato', role: 'DELIVERY', riskLevel: 'LOW', riskScore: 19, status: 'VERIFIED', location: LOCATIONS.BANGALORE },

    // --- RISKY / FLAGGED ---
    {
        name: 'Suresh Singh', phone: '9988776655', govId: 'XXXX-XXXX-5678', employer: 'Uber', role: 'RIDE', riskLevel: 'HIGH', riskScore: 85, status: 'PENDING', location: LOCATIONS.NOIDA,
        incidents: [{ type: 'SERIOUS', category: 'THEFT', description: 'Accused of stealing a package in 2023.', source: 'POLICE', severity: 'HIGH' }]
    },
    {
        name: 'Rajesh Koothrappali', phone: '9876500011', govId: '1111-2222-3333', employer: 'Ola', role: 'RIDE', riskLevel: 'MEDIUM', riskScore: 45, status: 'FLAGGED', location: LOCATIONS.GURGAON,
        incidents: [{ type: 'MINOR', category: 'MISCONDUCT', description: 'Rude behavior reported by multiple customers.', source: 'USER_REPORT', severity: 'MEDIUM' }]
    },
    {
        name: 'Deepak Chopra', phone: '9876500012', govId: '4444-5555-6666', employer: 'Swiggy', role: 'DELIVERY', riskLevel: 'HIGH', riskScore: 92, status: 'REJECTED', location: LOCATIONS.ROHINI,
        incidents: [
            { type: 'SERIOUS', category: 'FRAUD', description: 'Used fake ID for registration.', source: 'PLATFORM', severity: 'CRITICAL' },
            { type: 'SERIOUS', category: 'HARASSMENT', description: 'Harassment complaint filed at Rohini PS.', source: 'POLICE', severity: 'HIGH' }
        ]
    },
    {
        name: 'Sunil Shetty', phone: '9876500013', govId: '7777-8888-9999', employer: 'Urban Company', role: 'SERVICE', riskLevel: 'MEDIUM', riskScore: 55, status: 'VERIFIED', location: LOCATIONS.MUMBAI,
        incidents: [{ type: 'MINOR', category: 'LATE', description: 'Repeated late arrivals and cancellations.', source: 'PLATFORM', severity: 'LOW' }]
    },

    // --- PENDING / NEW ---
    { name: 'New Guy', phone: '9876500014', govId: '0000-0000-0000', employer: 'Zomato', role: 'DELIVERY', riskLevel: 'LOW', riskScore: 0, status: 'PENDING', location: LOCATIONS.DELHI },
];

async function main() {
    try {
        // Clean up
        await prisma.auditLog.deleteMany();
        await prisma.incident.deleteMany();
        await prisma.worker.deleteMany();
        console.log('Cleaned up existing data.');

        // Re-create Admin/Police (User table wasn't cleared in clean up above to avoid foreign key issues if strict, but let's clear it)
        await prisma.user.deleteMany();
        console.log('Cleaned up users.');

        await prisma.user.create({
            data: { name: 'Inspector Vijay', email: 'police@gov.in', password: 'password123', role: 'POLICE', agency: 'Cyberabad Police', phone: '100' }
        });
        await prisma.user.create({
            data: { name: 'Zomato Admin', email: 'admin@zomato.com', password: 'password123', role: 'PLATFORM_ADMIN', agency: 'Zomato', phone: 'admin' }
        });

        // Seed Workers
        for (const w of REAL_WORKERS) {
            const { incidents, location, ...workerData } = w;
            await prisma.worker.create({
                data: {
                    ...workerData,
                    latitude: location.lat,
                    longitude: location.lng,
                    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${w.name.replace(/\s/g, '')}`, // Dynamic avatars
                    incidents: {
                        create: incidents || []
                    }
                }
            });
        }

        // Add specific demo worker (Raju) if not in the list, ensuring he exists for the physical demo
        const rajuExists = REAL_WORKERS.find(w => w.phone === '9876543210');
        if (!rajuExists) {
            await prisma.worker.create({
                data: {
                    name: 'Raju Kumar',
                    phone: '9876543210',
                    govId: 'XXXX-XXXX-1234',
                    employer: 'Zomato',
                    role: 'DELIVERY',
                    riskLevel: 'LOW',
                    riskScore: 20,
                    status: 'VERIFIED',
                    photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                    latitude: LOCATIONS.DELHI.lat,
                    longitude: LOCATIONS.DELHI.lng,
                    incidents: { create: [] }
                }
            });
        }

        console.log(`Seeded ${REAL_WORKERS.length + 1} realistic workers.`);

    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
