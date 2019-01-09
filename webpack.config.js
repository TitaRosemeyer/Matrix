const path = require('path');
const chalk = require('chalk');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PostCompilePlugin = require('post-compile-webpack-plugin');
const webpack = require('webpack');

const options = {
  devServerPort: 3030,
  path: 'dist',
  filename: {
    css: 'bundle.css',
    js: 'bundle.js'
  }
};

const statsOptions = {
  stats: {
    chunks: false,
    children: false,
    modules: false,
    colors: true
  }
};

module.exports = (env, argv) => {
  return {
    context: path.resolve(__dirname, 'app'),
    entry: {
      app: './index.js'
    },
    optimization: {
      //minimization disabled by default in mode === 'development'
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    output: {
      path: path.resolve(__dirname),
      filename: path.join(options.path, options.filename.js),
      publicPath: '/'
    },
    devServer: {
      contentBase: path.join(__dirname, 'app'),
      port: options.devServerPort,
      open: true,
      watchContentBase: true,
      noInfo: true
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: path.join(options.path, options.filename.css) //'./dist/bundle.css'
      }),
      new PostCompilePlugin(stats => {
        console.log('\x1Bc'); // clear terminal
        const errorStr = chalk.bold.bgRed.black;
        const warningStr = chalk.bgYellow.black;
        const infoStr = chalk.magenta;
        const successStr = chalk.bold.bgGreen.black;

        if (stats.hasErrors() || stats.hasWarnings()) {
          console.log(stats.toString('errors-only'));
          console.log();
          if (stats.hasErrors()) {
            console.log(errorStr(' ERROR '), 'Compiled with errors!');
            argv.mode === 'production' && process.exit(1);
          }
          if (stats.hasWarnings()) {
            console.log(warningStr(' WARNING '), 'Compiled with warnings!');
            argv.mode === 'production' && process.exit(0);
          }
        } else {
          console.log(stats.toString(statsOptions.stats));
          if (argv.mode === 'development') {
            console.log(
              chalk.bold(`\n> Open http://localhost:${options.devServerPort}\n`)
            );
          } else if (argv.mode === 'production') {
            console.log(
              infoStr(`'${options.path}' folder is ready to be published`)
            );
          }
          console.log(successStr(' DONE '), 'Compiled successfully!');
          console.log();
          argv.mode === 'production' && process.exit(0);
        }
      })
    ]
  };
};
