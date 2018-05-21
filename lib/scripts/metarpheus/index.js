'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('../../util');

var _run = require('./run');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));

function mkDirs(filePath) {
  return new Promise(function (resolve, reject) {
    _fs2.default.mkdir(filePath, function (error) {
      if (error) {
        if (error.code === 'ENOENT') {
          return mkDirs(_path2.default.dirname(filePath)).then(function () {
            return mkDirs(filePath);
          }).then(resolve).catch(reject);
        } else {
          reject(error);
        }
      }
      resolve();
    });
  });
}

function mkDirsIfNotExist(filePath) {
  if (!_fs2.default.existsSync(filePath)) {
    return mkDirs(filePath);
  }
  return Promise.resolve();
}

var metarpheusConfig = (0, _config2.default)(args);

var apiOutDir = _path2.default.dirname(metarpheusConfig.apiOut);
var modelOutDir = _path2.default.dirname(metarpheusConfig.modelOut);

var _ref = function () {
  return (args.ts ? _run.runMetarpheusIoTs : _run.runMetarpheusTcomb)(metarpheusConfig, args);
}(),
    model = _ref.model,
    api = _ref.api;

// create dirs if don't exist


mkDirsIfNotExist(apiOutDir).then(function () {
  return mkDirsIfNotExist(modelOutDir);
}).then(function () {
  // write api in api output file
  _util.logger.metarpheus('Writing ' + metarpheusConfig.apiOut);
  _fs2.default.writeFileSync(metarpheusConfig.apiOut, api);
  _util.logger.metarpheus('Finished!');

  // write model in model output file
  _util.logger.metarpheus('Writing ' + metarpheusConfig.modelOut);
  _fs2.default.writeFileSync(metarpheusConfig.modelOut, model);
  _util.logger.metarpheus('Finished!');
}).catch(function (e) {
  _util.logger.metarpheus(e);
  process.exit(1);
});