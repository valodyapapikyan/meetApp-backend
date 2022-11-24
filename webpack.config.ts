import path from 'path';

module.exports = {
  entry: './index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'api.bundle.js'
  },
  target: 'node'
};