'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = undefined;
exports.loadFileFromArgument = loadFileFromArgument;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_debug2.default.enable('scriptoni:*');

function loadFileFromArgument(args, key, defaultPath) {
  var filePath = _path2.default.join(process.cwd(), args[key] ? args[key] : defaultPath);
  return _fs2.default.existsSync(filePath) && require(filePath);
}

var logger = exports.logger = {
  bin: (0, _debug2.default)('scriptoni:bin'),
  metarpheus: (0, _debug2.default)('scriptoni:metarpheus'),
  metarpheusDiff: (0, _debug2.default)('scriptoni:metarpheus-diff'),
  lint: (0, _debug2.default)('scriptoni:lint'),
  lintStyle: (0, _debug2.default)('scriptoni:lint-style'),
  webpack: (0, _debug2.default)('scriptoni:webpack')
};