import { Config } from 'jest';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.test' });

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules'],
};

export default config;
