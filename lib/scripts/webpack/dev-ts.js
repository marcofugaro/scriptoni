'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _webpackConfig = require('./webpack.config.js');

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _getWebpackConfig = require('./getWebpackConfig');

var _getWebpackConfig2 = _interopRequireDefault(_getWebpackConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));

var webpackConfigObject = (0, _getWebpackConfig2.default)(function (options) {
  return (0, _webpackConfig2.default)(_extends({}, options, { jsLoader: 'typescript' }));
}, 'dev-ts');

var server = new _webpackDevServer2.default((0, _compiler2.default)(webpackConfigObject), webpackConfigObject.devServer);

server.listen((0, _config2.default)(args).port);