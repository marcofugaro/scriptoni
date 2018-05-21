'use strict';

var _webpackBuild = require('./webpack.build.js');

var _webpackBuild2 = _interopRequireDefault(_webpackBuild);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

var _util = require('../../util');

var _util2 = require('./util');

var _getWebpackConfig = require('./getWebpackConfig');

var _getWebpackConfig2 = _interopRequireDefault(_getWebpackConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webpackBuildObject = (0, _getWebpackConfig2.default)(_webpackBuild2.default, 'build');

(0, _compiler2.default)(webpackBuildObject).run(function (err, stats) {
  if (err) {
    throw err;
  }
  _util.logger.webpack(stats.toString(_util2.statsOutputConfiguration));
});