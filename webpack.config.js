const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const distPath = path.resolve(__dirname, "dist");
module.exports = (env, argv) => {
  return {
    devServer: {
      contentBase: distPath,
      compress: argv.mode === 'production',
      port: 8000
    },
    entry: './bootstrap.js',
    output: {
      path: distPath,
      filename: "init.js",
      webassemblyModuleFilename: "init.wasm"
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
              MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(jpg|png|gif|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: "[name].[ext]",
              outputPath: "img",
              esModule: false
            }
          }
        }
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: './static', to: distPath },
        ],
      }),
      new WasmPackPlugin({
        crateDirectory: ".",
        extraArgs: "--no-typescript",
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
    ],
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
      ]
    },
    watch: argv.mode !== 'production'
  };
};
