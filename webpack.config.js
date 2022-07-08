const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { loader } = require('mini-css-extract-plugin');
//const HotModuleReplacementPlugin = require("hot-module-replacement-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`

const jsLoader = () => {
  const loaders = [{
    loader: "babel-loader",
    options: {
      presets: ['@babel/preset-env'],
     
     // requireConfigFile: false,
    }
  }]

  if (isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
}

console.log("is Prod", isProd);
console.log("is dev", isDev);

module.exports = {
 
  context: path.resolve(__dirname, 'src'),
  mode: "development",
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core')
    }
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 3000,
    hot: isDev
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new ESLintPlugin(
      {
        context: path.resolve(__dirname, 'node_modules/eslint-loader'),
      }
    )
    // new webpack.HotModuleReplacementPlugin({
    //   // Options...
    // })
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoader()

      }
    ],
  }
}