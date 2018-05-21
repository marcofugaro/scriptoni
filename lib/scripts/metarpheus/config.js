'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (args) {
  // get current working directory
  var cwd = process.cwd();
  // define user javascript config file path
  var ujcFilePath = _path2.default.resolve(cwd, args.metarpheusConfig || (args.ts ? 'metarpheus-ts-config.js' : 'metarpheus-config.js'));

  // TODO: fs.existsSync is deprecated
  var ujc = _fs2.default.existsSync(ujcFilePath) && require(ujcFilePath) || {};

  if (args.ts) {
    return _extends({
      isReadonly: false,
      runtime: true,
      newtypes: [],
      optionalType: _ioTsCodegen.undefinedType,
      apiPaths: [_path2.default.resolve(cwd, '../api/src/main/scala')],
      modelOut: _path2.default.resolve(cwd, 'src/metarpheus/model.ts'),
      apiOut: _path2.default.resolve(cwd, 'src/metarpheus/api.ts'),
      authRouteTermNames: ['withRole']
    }, ujc);
  } else {
    // default module prelude
    var modelPrelude = '// DO NOT EDIT MANUALLY - metarpheus-generated\n/* eslint-disable */\nimport t from \'tcomb\';\n';

    return _extends({
      apiPaths: [_path2.default.resolve(cwd, '../api/src/main/scala')],
      modelPrelude: modelPrelude,
      apiPrelude: modelPrelude + '\nimport * as m from \'./model\';\n',
      apiModelPrefix: 'm.',
      modelOut: _path2.default.resolve(cwd, 'src/metarpheus/model.js'),
      apiOut: _path2.default.resolve(cwd, 'src/metarpheus/api.js'),
      authRouteTermNames: ['withRole']
    }, ujc);
  }
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ioTsCodegen = require('io-ts-codegen');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }