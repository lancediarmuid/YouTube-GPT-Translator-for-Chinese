const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

if (process.env.NODE_ENV == null) {
  process.env.NODE_ENV = 'development';
}
const ENV = process.env.ENV = process.env.NODE_ENV;

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      ENV: JSON.stringify(ENV),
    },
  }),
  new CopyWebpackPlugin({
    patterns: [{
      from: 'manifest.json',
    },
    {
      from: 'src/images',
      to: 'images',
    },
    {
      from: 'src/css/*.css',
      to({ context, absoluteFilename }) {
        return 'contentscript/[name][ext]';
      },
    },
    {
      from: 'src/popup',
      to: 'popup',
    },
    {
      from: '_locales',
      to: '_locales',
    },
    ],
  }),
  new WriteFilePlugin(),
];

const fileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];
const moduleRules = [
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader'],
    exclude: /node_modules/,
  },
  {
    test: new RegExp(`.(${fileExtensions.join('|')})$`),
    use: 'file-loader?name=[name].[ext]',
    exclude: /node_modules/,
  },
  {
    test: /\.html$/,
    use: {
      loader: 'html-loader',
      options: {
        sources: false,
      },
    },
    exclude: /node_modules/,
  },
];

const config = {
  target: 'web',
  devtool: 'cheap-module-source-map',
  mode: process.env.NODE_ENV || 'development',
  entry: {
    'contentscript/index': path.join(__dirname, 'src', 'contentscript', 'index.js'),
    background: path.join(__dirname, 'background.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  module: {
    rules: moduleRules,
  },
  plugins,
};

if (ENV === 'development') {
  config.devtool = 'cheap-module-source-map';
}

module.exports = config;
