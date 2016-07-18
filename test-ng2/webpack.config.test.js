'use strict';

const webpack = require('webpack');
// const helpers = require('./config/helpers');


module.exports = {
  entry: {
    vendor: './config/vendor.testing.ts',
    boot: './test-ng2/boot.ts',
  },
  output: {
    path: '.bundles',
    filename: 'webpack.bundle.spec.[name].js'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  plugins: [
    // new webpack.NoErrorsPlugin(),
    // new webpack.optimize.CommonsChunkPlugin('webpack.bundle.spec.common.js')
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/, /typings/],
        // loader: 'babel-loader?presets[]=es2015&plugins[]=babel-plugin-espower!ts-loader', // babel-loaderがbabel-plugin-espowerを読み込む必要がある。
        loaders: ['awesome-typescript-loader?tsconfig=test-ng2/tsconfig.test.json', 'angular2-template-loader'],
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
  devtool: 'inline-source-map',
};
