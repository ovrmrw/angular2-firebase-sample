'use strict';

const webpack = require('webpack');


module.exports = [
  {
    entry: ['./test-rxjs/boot.js'],
    output: {
      path: '.bundles',
      filename: 'webpack.bundle.spec.rxjs.js',
    },
    resolve: {
      extensions: ['', '.ts', '.js']
    },
    plugins: [
      // new webpack.NoErrorsPlugin()
    ],
    module: {
      loaders: [
        {
          test: /\.ts$/,
          exclude: [/node_modules/, /typings/],
          // loader: 'babel-loader?presets[]=es2015&plugins[]=babel-plugin-espower!ts-loader', // babel-loaderがbabel-plugin-espowerを読み込む必要がある。
          loaders: ['awesome-typescript-loader'],
        },
      ]
    },
    devtool: 'inline-source-map',
  }
]

