'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getSupportedLocales;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var localeFileMatch = /^[a-z]+\.json$/;

function getSupportedLocales(localesPath) {
  return _fs2.default.readdirSync(localesPath).filter(function (localePath) {
    return !!localeFileMatch.exec(localePath);
  }).map(function (localePath) {
    return localePath.split('.')[0];
  });
}