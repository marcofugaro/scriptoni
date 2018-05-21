'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _progressBarWebpackPlugin = require('progress-bar-webpack-plugin');

var _progressBarWebpackPlugin2 = _interopRequireDefault(_progressBarWebpackPlugin);

var _stylelintWebpackPlugin = require('stylelint-webpack-plugin');

var _stylelintWebpackPlugin2 = _interopRequireDefault(_stylelintWebpackPlugin);

var _virtualModuleWebpackPlugin = require('virtual-module-webpack-plugin');

var _virtualModuleWebpackPlugin2 = _interopRequireDefault(_virtualModuleWebpackPlugin);

var _supportedLocales = require('./supportedLocales');

var _supportedLocales2 = _interopRequireDefault(_supportedLocales);

var _util = require('./util');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var JSLoader = _tcomb2.default.enums.of(['babel', 'typescript'], 'JSLoader');

exports.default = function (_ref) {
  var config = _ref.config,
      paths = _ref.paths,
      NODE_ENV = _ref.NODE_ENV,
      _ref$jsLoader = _ref.jsLoader,
      jsLoader = _ref$jsLoader === undefined ? JSLoader('babel') : _ref$jsLoader;


  var BabelLoader = {
    loader: 'babel-loader',
    options: JSON.parse(_fs2.default.readFileSync(paths.BABELRC, { encoding: 'utf8' }))
  };

  return {
    resolve: {
      modules: [paths.SRC, paths.COMPONENTS, paths.BASIC_COMPONENTS, paths.NODE_MODULES],
      extensions: JSLoader(jsLoader) === JSLoader('typescript') ? ['.js', '.ts', '.tsx', '.json'] : undefined
    },

    stats: {
      children: false
    },

    output: {
      library: 'webclient',
      libraryTarget: 'var',
      path: paths.BUILD,
      filename: 'bundle.[hash].js',
      publicPath: '/'
    },

    plugins: [new _virtualModuleWebpackPlugin2.default({
      moduleName: paths.VIRTUAL_CONFIG,
      contents: JSON.stringify(config.bundle)
    }), new _progressBarWebpackPlugin2.default(), new _webpack2.default.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.__supportedLocales__': JSON.stringify((0, _supportedLocales2.default)(paths.LOCALES))
    }), new _webpack2.default.IgnorePlugin(/^\.\/locale$/, /moment$/), new _stylelintWebpackPlugin2.default({
      files: '**/*.scss',
      syntax: 'scss'
    }), new _htmlWebpackPlugin2.default((0, _util.getHtmlPluginConfig)(NODE_ENV, config, paths))],

    module: {
      rules: [
      // linting with eslint
      {
        enforce: 'pre',
        test: /\.jsx?$/, // test for both js and jsx
        use: [{
          loader: 'eslint-loader',
          options: {
            failOnError: NODE_ENV === 'production',
            failOnWarning: NODE_ENV === 'production'
          }
        }],
        include: paths.SRC,
        exclude: paths.ASSETS
      }].concat(_toConsumableArray(function () {
        if (JSLoader(jsLoader) === JSLoader('babel')) {
          // babel transpiler
          return [{
            test: /\.jsx?$/, // test for both js and jsx
            use: [BabelLoader],
            exclude: [paths.ASSETS],
            include: [paths.SRC]
          }];
        }

        // TypeScript transpiler
        return [{
          test: /\.tsx?$$/,
          use: [BabelLoader, {
            loader: 'ts-loader'
          }],
          exclude: [paths.ASSETS],
          include: [paths.SRC]
        }, {
          test: /\.jsx?$$/,
          use: [BabelLoader],
          exclude: [paths.ASSETS],
          include: [paths.SRC]
        }];
      }()), [
      // copy theme fonts
      {
        test: paths.THEME_FONTS,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            context: paths.THEME
          }
        }]
      },
      // copy png and jpg images
      {
        test: /\.(png|jpg)$/,
        exclude: [paths.ASSETS],
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }]
      },
      // copy svg images
      {
        test: /\.svg$/,
        use: [_extends({}, BabelLoader, {
          options: _extends({}, BabelLoader.options, {
            presets: ['react']
          })
        }), {
          loader: 'svg-react-loader'
        }]
      },
      // import sass variables in JS
      {
        test: paths.VARIABLES_MATCH,
        use: [{
          loader: 'sass-variables-loader'
        }]
      },
      // copy generic assets, if any
      {
        include: [paths.ASSETS],
        use: [{
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            context: paths.ASSETS
          }
        }]
      }])
    },

    node: {
      constants: false
    }
  };
};