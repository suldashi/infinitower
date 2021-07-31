const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/engine.js',
  output: {
    filename: 'engine.js',
    path: path.resolve(__dirname, 'public', 'js'),
  },
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
};