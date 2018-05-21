'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getWebpackConfig;

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _paths = require('./paths');

var _paths2 = _interopRequireDefault(_paths);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getWebpackConfig(webpackConfigFn, target) {
  var args = (0, _minimist2.default)(process.argv.slice(2));

  var config = (0, _config2.default)(args);

  var paths = (0, _paths2.default)(args);

  var customConfig = args.webpackConfig ? _path2.default.join(process.cwd(), args.webpackConfig) : undefined;
  var customizeConfigFn = customConfig ? require(customConfig) : _identity2.default;

  _util.logger.webpack('platform', process.platform);
  var NODE_ENV = process.env.NODE_ENV || config.NODE_ENV || 'development';
  _util.logger.webpack('building with', 'NODE_ENV=' + NODE_ENV);
  _util.logger.webpack('Configuration', JSON.stringify(config, null, 4));

  var configArgs = { config: config, paths: paths, NODE_ENV: NODE_ENV };
  return customizeConfigFn(webpackConfigFn(configArgs), _extends({}, configArgs, {
    target: target
  }));
}