"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    // Create Admin
    const adminPassword = await argon2.hash('admin123');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@campuscompare.com' },
        update: {},
        create: {
            email: 'admin@campuscompare.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log({ admin });
    // Add more seeding data for colleges
    const colleges = [
        {
            name: 'Indian Institute of Technology Delhi',
            slug: 'iit-delhi',
            shortName: 'IIT Delhi',
            description: 'One of the prestigious IITs in India, known for excellence in engineering and technology.',
            overview: 'Established in 1961, IIT Delhi is a public technical and research university located in Hauz Khas, Delhi.',
            city: 'New Delhi',
            state: 'Delhi',
            collegeType: 'GOVERNMENT',
            feesMin: 100000,
            feesMax: 200000,
            rating: 4.8,
            placementAverage: 1500000,
            placementHighest: 10000000,
            popularCourses: ['B.Tech Computer Science', 'M.Tech Artificial Intelligence'],
            examsAccepted: ['JEE Advanced', 'GATE'],
            facilities: ['Hostel', 'Library', 'Sports', 'Wi-Fi Campus', 'Medical'],
            tags: ['Engineering', 'Top Ranked', 'Research'],
        },
        {
            name: 'National Institute of Technology Raipur',
            slug: 'nit-raipur',
            shortName: 'NIT Raipur',
            description: 'An Institute of National Importance offering quality engineering education in central India.',
            overview: 'Founded in 1956, NIT Raipur offers various UG and PG programs in engineering and architecture.',
            city: 'Raipur',
            state: 'Chhattisgarh',
            collegeType: 'GOVERNMENT',
            feesMin: 70000,
            feesMax: 140000,
            rating: 4.2,
            placementAverage: 800000,
            placementHighest: 4000000,
            popularCourses: ['B.Tech Information Technology', 'B.Tech Mining'],
            examsAccepted: ['JEE Main', 'GATE'],
            facilities: ['Hostel', 'Library', 'Cafeteria', 'Sports'],
            tags: ['Engineering', 'NIT'],
        },
        {
            name: 'Vellore Institute of Technology',
            slug: 'vit-vellore',
            shortName: 'VIT Vellore',
            description: 'A top-ranked private deemed university offering a wide range of academic programs.',
            overview: 'VIT is known for its extensive campus, global tie-ups, and excellent placement record.',
            city: 'Vellore',
            state: 'Tamil Nadu',
            collegeType: 'DEEMED',
            feesMin: 150000,
            feesMax: 300000,
            rating: 4.5,
            placementAverage: 900000,
            placementHighest: 6000000,
            popularCourses: ['B.Tech CSE', 'BCA', 'MCA'],
            examsAccepted: ['VITEEE'],
            facilities: ['AC Hostels', 'Swimming Pool', 'Gym', 'Smart Classrooms'],
            tags: ['Engineering', 'Private', 'Placement'],
        }
    ];
    for (const c of colleges) {
        const existing = await prisma.college.findUnique({ where: { slug: c.slug } });
        if (!existing) {
            await prisma.college.create({
                data: {
                    ...c,
                    courses: {
                        create: [
                            {
                                name: c.popularCourses[0],
                                category: 'Engineering',
                                duration: '4 Years',
                                fees: c.feesMax,
                            }
                        ]
                    }
                }
            });
        }
    }
    console.log('Seeding completed.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map