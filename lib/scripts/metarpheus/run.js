'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runMetarpheusTcomb = runMetarpheusTcomb;
exports.runMetarpheusIoTs = runMetarpheusIoTs;

var _metarpheusTcomb2 = require('metarpheus-tcomb');

var _metarpheusTcomb3 = _interopRequireDefault(_metarpheusTcomb2);

var _metarpheusIoTs = require('metarpheus-io-ts');

var _util = require('../../util');

var _metarpheus = require('metarpheus');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getMetarpheusConfig(config, args) {
  var authRouteTermNames = config.authRouteTermNames,
      modelsForciblyInUse = config.modelsForciblyInUse,
      wiro = config.wiro;

  var useWiro = args.wiro || wiro;
  return { authRouteTermNames: authRouteTermNames, modelsForciblyInUse: modelsForciblyInUse, wiro: useWiro };
}

// RUN METARPHEUS
function runMetarpheusTcomb(metarpheusTcombConfig, args) {

  var metarpheusConfig = getMetarpheusConfig(metarpheusTcombConfig, args);
  var intermRep = (0, _metarpheus.run)(metarpheusTcombConfig.apiPaths, metarpheusConfig);

  // METARPHEUS-TCOMB
  _util.logger.metarpheus('Starting metarpheus-tcomb');
  var overrides = metarpheusTcombConfig.overrides,
      modelPrelude = metarpheusTcombConfig.modelPrelude,
      apiPrelude = metarpheusTcombConfig.apiPrelude,
      apiModelPrefix = metarpheusTcombConfig.apiModelPrefix,
      renameModel = metarpheusTcombConfig.renameModel;
  // use metarpheus-tcomb node api to generate model and api

  var _metarpheusTcomb = (0, _metarpheusTcomb3.default)({
    intermRep: intermRep,
    config: {
      overrides: overrides,
      modelPrelude: modelPrelude,
      apiPrelude: apiPrelude,
      apiModelPrefix: apiModelPrefix,
      renameModel: renameModel
    }
  }),
      model = _metarpheusTcomb.model,
      api = _metarpheusTcomb.api;

  _util.logger.metarpheus('Finished metarpheus-tcomb');
  return { model: model, api: api };
}

function runMetarpheusIoTs(metarpheusTsConfig, args) {

  var metarpheusConfig = getMetarpheusConfig(metarpheusTsConfig, args);
  var intermRep = (0, _metarpheus.run)(metarpheusTsConfig.apiPaths, metarpheusConfig);

  _util.logger.metarpheus('Starting metarpheus-io-ts');
  var model = (0, _metarpheusIoTs.getModels)(intermRep.models, metarpheusTsConfig, metarpheusTsConfig.modelPrelude);

  var api = (metarpheusTsConfig.apiPrelude || '') + '\n\n' + (0, _metarpheusIoTs.getRoutes)(intermRep.routes, metarpheusTsConfig) + '\n';

  _util.logger.metarpheus('Finished metarpheus-io-ts');
  return { model: model, api: api };
}