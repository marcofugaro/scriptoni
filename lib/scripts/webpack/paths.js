'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getPaths;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Paths = _tcomb2.default.interface({
  ROOT: _tcomb2.default.String,
  SRC: _tcomb2.default.String,
  ENTRY: _tcomb2.default.String,
  LOCALES: _tcomb2.default.String,
  THEME: _tcomb2.default.String,
  THEME_FONTS: _tcomb2.default.String,
  BUILD: _tcomb2.default.String,
  ASSETS: _tcomb2.default.String,
  NODE_MODULES: _tcomb2.default.String,
  COMPONENTS: _tcomb2.default.String,
  BASIC_COMPONENTS: _tcomb2.default.String,
  VIRTUAL_CONFIG: _tcomb2.default.String,
  TEMPLATE: _tcomb2.default.String,
  VARIABLES_MATCH: _tcomb2.default.Object, // regex
  BABELRC: _tcomb2.default.String
});

function getPaths(args) {
  var userPaths = (0, _util.loadFileFromArgument)(args, 'paths', './paths.js') || {};
  var ROOT = userPaths.ROOT || process.cwd();

  return Paths(_extends({
    // defaultPaths
    ROOT: ROOT,
    SRC: _path2.default.resolve(ROOT, 'src'),
    ENTRY: _path2.default.resolve(ROOT, 'src/setup/index.js'),
    LOCALES: _path2.default.resolve(ROOT, 'src/locales'),
    THEME: _path2.default.resolve(ROOT, 'src/theme'),
    THEME_FONTS: _path2.default.resolve(ROOT, 'src/theme/fonts'),
    BUILD: _path2.default.resolve(ROOT, 'build'),
    ASSETS: _path2.default.resolve(ROOT, 'assets'),
    NODE_MODULES: _path2.default.resolve(ROOT, 'node_modules'),
    COMPONENTS: _path2.default.resolve(ROOT, 'src/components'),
    BASIC_COMPONENTS: _path2.default.resolve(ROOT, 'src/components/Basic'),
    VIRTUAL_CONFIG: _path2.default.resolve(ROOT, 'src/config.json'),
    TEMPLATE: _path2.default.resolve(ROOT, 'src/index.html'),
    VARIABLES_MATCH: /(v|V)ariables\.scss$/,
    BABELRC: _path2.default.resolve(ROOT, '.babelrc')
  }, userPaths));
}