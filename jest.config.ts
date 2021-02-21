export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*Protocols.ts',
    '!**/protocols/**',
    '!**/test/**'
  ],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}