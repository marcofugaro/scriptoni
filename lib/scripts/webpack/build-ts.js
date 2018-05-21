'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webpackBuild = require('./webpack.build.js');

var _webpackBuild2 = _interopRequireDefault(_webpackBuild);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _util = require('../../util');

var _util2 = require('./util');

var _getWebpackConfig = require('./getWebpackConfig');

var _getWebpackConfig2 = _interopRequireDefault(_getWebpackConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webpackBuildObject = (0, _getWebpackConfig2.default)(function (options) {
  return (0, _webpackBuild2.default)(_extends({}, options, { jsLoader: 'typescript' }));
}, 'build-ts');

(0, _compiler2.default)(webpackBuildObject).run(function (err, stats) {
  if (err) {
    throw err;
  }
  _util.logger.webpack(stats.toString(_util2.statsOutputConfiguration));
});