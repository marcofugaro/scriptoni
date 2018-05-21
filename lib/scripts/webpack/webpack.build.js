'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _compressionWebpackPlugin = require('compression-webpack-plugin');

var _compressionWebpackPlugin2 = _interopRequireDefault(_compressionWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _webpackFailPlugin = require('webpack-fail-plugin');

var _webpackFailPlugin2 = _interopRequireDefault(_webpackFailPlugin);

var _uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

var _uglifyjsWebpackPlugin2 = _interopRequireDefault(_uglifyjsWebpackPlugin);

var _webpack3 = require('./webpack.base');

var _webpack4 = _interopRequireDefault(_webpack3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (_ref) {
  var config = _ref.config,
      paths = _ref.paths,
      NODE_ENV = _ref.NODE_ENV,
      options = _objectWithoutProperties(_ref, ['config', 'paths', 'NODE_ENV']);

  var base = (0, _webpack4.default)(_extends({ config: config, paths: paths, NODE_ENV: NODE_ENV }, options));

  var plugins = [
  // cause failed production builds to fail faster
  new _webpack2.default.NoEmitOnErrorsPlugin(), new _webpack2.default.optimize.ModuleConcatenationPlugin(), new _extractTextWebpackPlugin2.default({ filename: 'style.[hash].min.css' }), _webpackFailPlugin2.default // This is needed for TS builds because of https://github.com/TypeStrong/ts-loader/pull/172
  ];

  if (NODE_ENV === 'production') {
    plugins.unshift(new _compressionWebpackPlugin2.default({
      regExp: /\.js$|\.css$/
    }));

    plugins.unshift(new _uglifyjsWebpackPlugin2.default({
      uglifyOptions: {
        ecma: 8,
        output: {
          ecma: 5
        }
      },
      parallel: true,
      cache: true,
      sourceMap: true
    }));
  }

  return _extends({}, base, {

    bail: true,

    entry: paths.ENTRY,

    devtool: 'source-map',

    plugins: [].concat(_toConsumableArray(base.plugins), plugins),

    module: _extends({}, base.module, {
      rules: [].concat(_toConsumableArray(base.module.rules), [{
        test: /\.css$/,
        use: _extractTextWebpackPlugin2.default.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      // SASS
      {
        test: /\.scss$/,
        exclude: paths.VARIABLES_MATCH,
        use: _extractTextWebpackPlugin2.default.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: { sourceMap: true }
          }, {
            loader: 'resolve-url-loader',
            options: { sourceMap: true }
          }, {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }]
        })
      }])
    })
  });
};