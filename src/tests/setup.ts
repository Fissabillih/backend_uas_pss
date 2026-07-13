import prisma from '../config/database';

// Ensure DB connection is alive for integration tests
beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
