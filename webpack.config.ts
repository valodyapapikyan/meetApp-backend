const path = require('path');
const { IgnorePlugin } = require('webpack');


module.exports = {
  entry: './index.ts',
  // plugins: [
  //   new IgnorePlugin(/^pg-native$/)

	// ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'api.bundle.js'
  },
  target: 'node'
};