'use strict';

const webpack = require('webpack');
// const helpers = require('./config/helpers');


module.exports = {
  entry: {
    vendor: './config/vendor.ts',
    boot: './src/boot.ts',
  },
  output: {
    path: '.dest',
    filename: 'webpack.bundle.[name].js'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  plugins: [
    // new webpack.NoErrorsPlugin(),
    // new webpack.optimize.CommonsChunkPlugin('webpack.bundle.common.js')
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/, /typings/],
        // loader: 'babel-loader!ts-loader' // first ts-loader(with tsconfig.json), second babel-loader
        loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
      {
        test: /\.css$/,
        loader: 'raw-loader'
      }
    ]
  },
  devtool: 'source-map', // output source map
};