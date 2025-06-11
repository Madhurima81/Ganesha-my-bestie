export default {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest'
    },
    moduleNameMapper: {
      '\\.(css|less|scss)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|gif)$': '<rootDir>/__mocks__/fileMock.js'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleFileExtensions: ['js', 'jsx', 'json'],
  };