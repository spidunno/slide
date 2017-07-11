var path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: true
  },
  module: {
    rules: [
      {
        include: path.resolve(__dirname, 'js'),
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};
