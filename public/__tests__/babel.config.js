module.exports = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-class-properties']
}

test('dummy test for babel.config.js', () => {
    expect(true).toBe(true);
  });  