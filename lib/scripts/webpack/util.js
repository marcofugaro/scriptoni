'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHtmlPluginConfig = getHtmlPluginConfig;
function getHtmlPluginConfig(NODE_ENV, config, paths) {
  return {
    inject: false,
    bundle: NODE_ENV === 'production',
    minify: NODE_ENV === 'production' ? {} : false,
    template: paths.TEMPLATE,
    title: config.title,
    data: config.bundle
  };
}

var statsOutputConfiguration = exports.statsOutputConfiguration = {
  assets: false,
  children: false,
  chunkModules: false,
  chunkOrigins: false,
  chunks: false,
  timings: true,
  colors: true
};