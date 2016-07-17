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
    new webpack.optimize.CommonsChunkPlugin('webpack.bundle.common.js')
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/, /typings/],
        // loader: 'babel-loader!ts-loader' // first ts-loader(with tsconfig.json), second babel-loader
        loaders: ['awesome-typescript-loader?library=es6&useBabel=true&babelOptions.presets[]=es2015&useCache=true&doTypeCheck=false', 'angular2-template-loader'],
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


  // "awesomeTypescriptLoaderOptions": {
  //   "library": "es6",
  //   "useBabel": true,
  //   "babelOptions": {
  //     "presets": [
  //       "es2015"
  //     ],
  //     "plugins": []
  //   },
  //   "useCache": true,
  //   "useWebpackText": true,
  //   "doTypeCheck": false
  // }