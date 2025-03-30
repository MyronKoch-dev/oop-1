/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Use Node.js environment for backend tests
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // Specify paths to look for test files
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  // Module name mapper to handle path aliases like @/lib/...
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Setup files to run before each test file (optional, can add later)
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}; 