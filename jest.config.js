module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/fakes',
    '!<rootDir>/src/**/*Protocols.ts',
    '!**/protocols/**',
    '!**/test/**'
  ],
  preset: '@shelf/jest-mongodb',
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}