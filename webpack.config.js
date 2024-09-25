const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    background: path.join(__dirname, 'src', 'background', 'background.js'),
    popup: path.join(__dirname, 'src', 'popup', 'popup.jsx'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  devtool: 'inline-source-map',
  watch: true,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
              publicPath: 'images',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets/icons', to: 'icons' },
        { from: 'src/assets/images', to: 'images' },
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'src/popup/popup.css', to: 'popup.css' },
        {
          from: 'src/popup/styles/effects.css',
          to: 'style_modules/effects.css',
        },
        { from: 'src/content', to: 'content' },
        { from: 'src/background', to: 'background' },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
};
