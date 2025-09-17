module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  setupFiles: ['<rootDir>/test/setup.js'],
  // collectCoverage: true, // enable if you want coverage
};
