'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var srcPath = _path2.default.resolve(__dirname, 'scripts');
var libPath = _path2.default.resolve(__dirname, '..', 'lib', 'scripts');

var copyToLib = function copyToLib(file) {
  _fs2.default.writeFileSync(_path2.default.resolve(libPath, file), _fs2.default.readFileSync(_path2.default.resolve(srcPath, file)));
};

var files = ['eslint/eslintrc.json', 'stylelint/stylelintrc.json', 'webpack/tsconfig.json'];

files.map(copyToLib);