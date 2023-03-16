/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  moduleNameMapper: {
    '~/(.*)': ['<rootDir>/src/$1'],
  },
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/test/setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setupAfterEnv.ts'],
  silent: false,
  testEnvironment: 'jsdom',
  transform: {},
  verbose: true,

  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}', '!**/*.{spec,test}.{ts,tsx}'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text'],
};
