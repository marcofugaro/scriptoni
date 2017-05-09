import minimist from 'minimist';
import webpackServer from 'webpack-dev-server';
import webpackConfig from './webpack.config.js';
import compiler from './compiler';
import getConfig from './config';
import getPaths from './paths';
import { statsOutputConfiguration } from './util';

const args = minimist(process.argv.slice(2));
const paths = getPaths(args);

const server = new webpackServer(compiler(webpackConfig), {
  contentBase: paths.BUILD,
  hot: true,
  stats: statsOutputConfiguration
});

server.listen(getConfig(args).port);