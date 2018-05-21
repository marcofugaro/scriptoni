'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getConfig;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _tcomb = require('tcomb');

var _tcomb2 = _interopRequireDefault(_tcomb);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfigType = _tcomb2.default.interface({
  bundle: _tcomb2.default.interface({})
}, { name: 'Config', strict: true });

// Get path for user configuration, default to './config' from user current working directory
var getConfigRelativePath = function getConfigRelativePath(args) {
  var configRelativePath = args.c || './config';
  return _path2.default.resolve(process.cwd(), configRelativePath);
};

// convert js config variable to env variable and prefix it with 'CONFIG_'
var jsConfigVariableToEnvConfigVariable = function jsConfigVariableToEnvConfigVariable(s) {
  return 'CONFIG_' + s.replace(/[A-Z]/g, function (m) {
    return '_' + m[0];
  }).toUpperCase();
};

// try to read and parse a json file
var readOptionalConfigFile = function readOptionalConfigFile(fullPath) {
  try {
    var contents = _fs2.default.readFileSync(fullPath, 'utf8');
    try {
      return JSON.parse(contents);
    } catch (e) {
      /* eslint-disable no-console */
      console.log();
      console.log('ERR: invalid JSON in ', fullPath);
      /* eslint-enable no-console */
      process.exit(1);
      return {};
    }
  } catch (e) {
    return {};
  }
};

// try to load configuration type from the user project, fallback on BaseConfig
var getConfigType = function getConfigType(configFolderPath) {
  var configTypePath = _path2.default.resolve(configFolderPath, './Config.js');
  if (!_fs2.default.existsSync(configTypePath)) {
    /* eslint-disable no-console */
    console.warn('\n        No Config type definition file found in ' + configTypePath + ', using the default one...\n      ');
    /* eslint-enable no-console */
    return defaultConfigType;
  }
  return require(configTypePath);
};

var nodeEnv = process.env.NODE_ENV || 'development';

var getConfigurationFromEnv = function getConfigurationFromEnv(keys) {
  return keys.reduce(function (acc, k) {
    var envVar = process.env[jsConfigVariableToEnvConfigVariable(k)];
    if (typeof envVar !== 'undefined') {
      acc[k] = envVar;
    }
    return acc;
  }, {});
};

function getConfig(args) {

  // get user configuration folder path
  var configFolderPath = getConfigRelativePath(args);

  // load NODE_ENV related configuration
  var referenceConfigFilePath = _path2.default.resolve(configFolderPath, './' + nodeEnv + '.json');
  var referenceConfig = readOptionalConfigFile(referenceConfigFilePath);

  // load local configuration
  var localConfigFilePath = _path2.default.resolve(configFolderPath, './local.json');
  var localConfig = readOptionalConfigFile(localConfigFilePath);

  var fileConfig = _extends({}, referenceConfig, localConfig, {
    bundle: _extends({}, referenceConfig.bundle, localConfig.bundle)
  });

  // get Config type
  var ConfigType = getConfigType(configFolderPath);

  // merge environment config values into fileConfig
  var topLevelKeys = Object.keys((0, _omit2.default)(ConfigType.meta.props, 'bundle'));
  var bundleKeys = Object.keys(ConfigType.meta.props.bundle.meta.props);
  var config = _extends({}, fileConfig, getConfigurationFromEnv(topLevelKeys), {
    bundle: _extends({}, fileConfig.bundle, getConfigurationFromEnv(bundleKeys))
  });

  if (!ConfigType.is(config)) {
    throw new Error('Configuration is invalid! ' + JSON.stringify(config, null, 4));
  }
  return ConfigType(config);
}