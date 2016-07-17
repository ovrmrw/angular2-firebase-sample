/*
  https://github.com/AngularClass/angular2-webpack-starter/blob/master/config/webpack.prod.js
  上記から少し拝借した。
*/

'use strict';

const webpack = require('webpack');
// const helpers = require('./config/helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';


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
    new webpack.optimize.CommonsChunkPlugin('webpack.bundle.common.js'),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: { screw_ie8: true },
      compress: { screw_ie8: true },
      comments: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
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
        loader: "raw-loader",
      },
      {
        test: /\.css$/,
        loader: 'raw-loader'
      }
    ]
  }
};