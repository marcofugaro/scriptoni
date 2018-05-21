'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _diff = require('diff');

var _chalk = require('chalk');

var _config = require('../metarpheus/config');

var _config2 = _interopRequireDefault(_config);

var _run = require('../metarpheus/run');

var _util = require('../../util');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = (0, _minimist2.default)(process.argv.slice(2));

var metarpheusConfig = (0, _config2.default)(args);

var _ref = (args.ts ? _run.runMetarpheusIoTs : _run.runMetarpheusTcomb)(metarpheusConfig, args),
    model = _ref.model,
    api = _ref.api;

function colorLine(line) {
  switch (line[0]) {
    case '+':
      return (0, _chalk.green)(line);
    case '-':
      return (0, _chalk.red)(line);
    default:
      return line;
  }
}

function colorizePatch(patch) {
  return patch.split('\n').map(colorLine).join('\n');
}

// API diff
_util.logger.metarpheusDiff('Diffing api files...');
var apiNew = _fs2.default.readFileSync(metarpheusConfig.apiOut, 'utf-8');
var apiExitCode = (0, _diff.structuredPatch)('', '', api, apiNew).hunks.length === 0 ? 0 : 1;
var apiOutput = colorizePatch((0, _diff.createTwoFilesPatch)('current', 'new', api, apiNew));

if (apiExitCode !== 0) {
  console.log(apiOutput); // eslint-disable-line no-console
}

// model diff
_util.logger.metarpheusDiff('Diffing models files...');
var modelNew = _fs2.default.readFileSync(metarpheusConfig.modelOut, 'utf-8');
var modelExitCode = (0, _diff.structuredPatch)('', '', model, modelNew).hunks.length === 0 ? 0 : 1;
var modelOutput = colorizePatch((0, _diff.createTwoFilesPatch)('current', 'new', model, modelNew));

if (modelExitCode !== 0) {
  console.log(modelOutput); // eslint-disable-line no-console
}

// exit with code from diffs
process.exit(modelExitCode || apiExitCode);