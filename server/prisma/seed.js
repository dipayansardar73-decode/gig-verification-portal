
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Clean up existing data
    try {
        await prisma.auditLog.deleteMany();
        await prisma.incident.deleteMany();
        await prisma.worker.deleteMany();
        await prisma.user.deleteMany();
    } catch (e) {
        console.log('Error cleaning up, maybe tables dont exist yet');
    }

    // Create Users
    const police = await prisma.user.create({
        data: {
            name: 'Inspector Vijay',
            email: 'police@gov.in',
            password: 'password123',
            role: 'POLICE',
            agency: 'Cyberabad Police'
        }
    });

    const admin = await prisma.user.create({
        data: {
            name: 'Zomato Admin',
            email: 'admin@zomato.com',
            password: 'password123',
            role: 'PLATFORM_ADMIN',
            agency: 'Zomato'
        }
    });

    // Create Workers
    const workersData = [
        {
            name: 'Raju Kumar',
            phone: '9876543210',
            govId: 'XXXX-XXXX-1234',
            employer: 'Zomato',
            role: 'DELIVERY',
            riskLevel: 'LOW',
            riskScore: 20,
            status: 'VERIFIED',
            photoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            latitude: 28.6139,
            longitude: 77.2090, // New Delhi
            incidents: []
        },
        {
            name: 'Suresh Singh',
            phone: '9988776655',
            govId: 'XXXX-XXXX-5678',
            employer: 'Uber',
            role: 'RIDE',
            riskLevel: 'HIGH',
            riskScore: 85,
            status: 'PENDING',
            photoUrl: undefined,
            latitude: 28.5355,
            longitude: 77.3910, // Noida
            incidents: [
                {
                    type: 'SERIOUS',
                    category: 'THEFT',
                    description: 'Accused of stealing a package in 2023.',
                    source: 'POLICE',
                    severity: 'HIGH'
                }
            ]
        },
        {
            name: 'Amit Verma',
            phone: '8888888888',
            govId: 'XXXX-XXXX-9999',
            employer: 'Urban Company',
            role: 'SERVICE',
            riskLevel: 'MEDIUM',
            riskScore: 50,
            status: 'VERIFIED',
            latitude: 28.4595,
            longitude: 77.0266, // Gurgaon
            incidents: []
        }
    ];

    for (const w of workersData) {
        const { incidents, ...workerData } = w;
        await prisma.worker.create({
            data: {
                ...workerData,
                incidents: {
                    create: incidents
                }
            }
        });
    }

    console.log({ police, admin, workersCount: workersData.length });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
