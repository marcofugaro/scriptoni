'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compiler;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function compiler(webpackConfig) {
  var compiler = (0, _webpack2.default)(webpackConfig);

  compiler.plugin('compile', function () {
    _util.logger.webpack('Start compiling...');
  });

  compiler.plugin('failed', function (err) {
    _util.logger.webpack(err);
  });

  return compiler;
}