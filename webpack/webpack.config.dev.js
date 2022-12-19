const Path = require('path');
const Webpack = require('webpack');
const { merge } = require('webpack-merge');
// const ESLintPlugin = require('eslint-webpack-plugin');
// const StylelintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  target: 'web',
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  output: {
    chunkFilename: 'js/[name].chunk.js',
  },
  devServer: {
    client: {
      logging: 'error',
    },
    hot: true,
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    // new ESLintPlugin({
    //   extensions: 'js',
    //   emitWarning: true,
    //   files: Path.resolve(__dirname, '../src'),
    // }),
    // new StylelintPlugin({
    //   files: Path.join('src', '**/*.s?(a|c)ss'),
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].chunk.js',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
      },
      {
        test: /\.s?css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
});