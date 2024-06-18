module.exports = {
    testEnvironment: 'node',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    testMatch: ['**/__tests__/**/*.js?(x)'],
  };
  
  test('dummy test for jest.config.js', () => {
    expect(true).toBe(true);
  });
module.exports = {
    setupFiles: ['./jest.setup.js'],
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  };
