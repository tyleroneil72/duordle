import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { diagnostics: false }]
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};

export default config;
