const path = require('path');

module.exports = {
  entry: './scripts/create-config.ts',
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'scripts'),
    filename: 'create-config.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  }
};