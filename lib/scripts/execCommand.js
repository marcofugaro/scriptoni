'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = execCommand;

var _child_process = require('child_process');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function execCommand(cmd, defaultArgs, logger) {

  var userArgs = (0, _minimist2.default)(process.argv.slice(2));

  var args = _extends({}, defaultArgs, userArgs, {
    _: userArgs._.length > 0 ? userArgs._ : defaultArgs._ || []
  });

  var command = [cmd].concat(_toConsumableArray(args._), _toConsumableArray(Object.keys(args).filter(function (k) {
    return k !== '_';
  }).map(function (k) {
    if (typeof args[k] === 'boolean') {
      return '--' + k;
    } else {
      return '--' + k + ' ' + args[k];
    }
  }))).join(' ');

  logger('Running  ' + command);

  try {
    (0, _child_process.execSync)(command, { stdio: 'inherit' });
  } catch (err) {
    process.exit(1);
  }
}