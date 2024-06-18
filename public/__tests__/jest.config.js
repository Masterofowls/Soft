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
  