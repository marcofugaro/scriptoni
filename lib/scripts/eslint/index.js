'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('../../util');

var _execCommand = require('../execCommand');

var _execCommand2 = _interopRequireDefault(_execCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwd = process.cwd();
var cmd = _path2.default.resolve(cwd, 'node_modules', 'eslint', 'bin', 'eslint.js');

var defaultArgs = {
  cache: true,
  _: ['src']
};

(0, _execCommand2.default)(cmd, defaultArgs, _util.logger.lint);