/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@validators/(.*)$': '<rootDir>/src/validators/$1',
    '^@dto/(.*)$': '<rootDir>/src/dto/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@prisma/(.*)$': '<rootDir>/src/prisma/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/tests/**',
    '!src/app.ts',
    '!src/swagger/**',
    '!src/types/**',
    '!src/dto/**',
    '!src/prisma/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterFramework: [],
  globalSetup: undefined,
  testTimeout: 30000,
  verbose: true,
};
