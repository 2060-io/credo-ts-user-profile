import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/build/', '/node_modules/', '/__tests__/', 'test'],
  coverageDirectory: '<rootDir>/coverage/',
  verbose: true,
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleNameMapper: {
    '@2060-agent-sdk/(.+)': [
      '<rootDir>/../../packages/$1/src',
      '<rootDir>/../packages/$1/src',
      '<rootDir>/packages/$1/src',
    ],
  },
}

export default config
