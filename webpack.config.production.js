/*
  https://github.com/AngularClass/angular2-webpack-starter/blob/master/config/webpack.prod.js
  上記から少し拝借した。
*/

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
  doTypeCheck: false
};

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';


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
        loader: 'awesome-typescript-loader', // babel-loader!ts-loader と同じようなもの 
        query: atlQuery
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        query: {
          minimize: false
          // minimize: true,
          // removeAttributeQuotes: false,
          // caseSensitive: true,
          // customAttrSurround: [
          //   [/#/, /(?:)/],
          //   [/\*/, /(?:)/],
          //   [/\[?\(?/, /(?:)/]
          // ],
          // customAttrAssign: [/\)?\]?=/]
        }
      },
      {
        test: /\.css$/,
        // include: helpers.root('src'),
        loader: 'raw-loader'
      }
    ]
  },
  // node: {
  //   global: 'window',
  //   crypto: 'empty',
  //   process: false,
  //   module: false,
  //   clearImmediate: false,
  //   setImmediate: false
  // }
  // devtool: 'source-map', // output source map
};