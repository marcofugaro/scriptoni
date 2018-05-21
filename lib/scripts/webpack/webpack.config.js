'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpack3 = require('./webpack.base');

var _webpack4 = _interopRequireDefault(_webpack3);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

exports.default = function (_ref) {
  var config = _ref.config,
      paths = _ref.paths,
      NODE_ENV = _ref.NODE_ENV,
      options = _objectWithoutProperties(_ref, ['config', 'paths', 'NODE_ENV']);

  var base = (0, _webpack4.default)(_extends({ config: config, paths: paths, NODE_ENV: NODE_ENV }, options));
  return _extends({}, base, {
    entry: ['webpack-dev-server/client?http://0.0.0.0:' + config.port + '/', 'webpack/hot/dev-server', paths.ENTRY],

    devServer: {
      contentBase: paths.BUILD,
      hot: true,
      stats: _util.statsOutputConfiguration,
      disableHostCheck: true,
      historyApiFallback: { verbose: true }
    },

    devtool: config.devTool || 'source-map',

    plugins: [].concat(_toConsumableArray(base.plugins), [new _webpack2.default.HotModuleReplacementPlugin()]),

    module: _extends({}, base.module, {
      rules: [].concat(_toConsumableArray(base.module.rules), [
      // style!css loaders
      {
        test: /\.css?$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }]
      },
      // SASS loaders
      {
        test: /\.scss?$/,
        exclude: paths.VARIABLES_MATCH,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'resolve-url-loader'
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }]
      }])
    })
  });
};