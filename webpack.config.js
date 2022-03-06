import { resolve } from 'node:path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'

/**
 * @returns {import('webpack').Configuration}
 */
export default function defineConfig(env) {
  return {
    mode: 'development',
    entry: {
      main: resolve(import.meta.dirname, 'src/main.js'),
    },
    output: {
      filename: '[name].[contenthash].js',
    },
    module: {
      rules: [
        {
          resourceQuery: /raw/,
          type: 'asset/source',
        },
        {
          test: /\.vue$/,
          use: ['vue-loader'],
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader'],
        },
        {
          test: /\.less$/,
          use: ['vue-style-loader', 'css-loader', 'less-loader'],
        },
        {
          resourceQuery: /^((?!raw).)*$/,
          test: /\.jsx?$/i,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                plugins: ['@vue/babel-plugin-jsx'],
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve(import.meta.dirname, 'src/index.html'),
      }),
      new VueLoaderPlugin(),
      new MonacoWebpackPlugin(),
    ],
    optimization: {
      minimizer: [new TerserPlugin({ extractComments: false })],
    },
    performance: {
      maxEntrypointSize: 10 * 1024 * 1024,
      maxAssetSize: 10 * 1024 * 1024,
    },
  }
}
