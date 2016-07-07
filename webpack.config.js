'use strict';

const webpack = require('webpack');
const helpers = require('./config/helpers');

const atlQuery = { // stands for 'awesome-typescript-loader query'
  library: 'es6',
  useBabel: true,
  babelOptions: {
    presets: ['es2015'],
    plugins: []
  },
  useCache: true,
  // doTypeCheck: false
};


module.exports = {
  entry: ['./src/boot.ts'],
  output: {
    path: '.dest',
    filename: 'webpack.bundle.js'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  plugins: [
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/, /typings/],
        // loader: 'babel-loader!ts-loader' // first ts-loader(with tsconfig.json), second babel-loader
        loader: 'awesome-typescript-loader', // babel-loader!ts-loader と同じようなもの 
        query: atlQuery
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.css$/,
        // include: helpers.root('src'),
        loader: 'raw-loader'
      }
    ]
  },
  devtool: 'source-map', // output source map
};