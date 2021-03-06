#!/usr/bin/env node

var spawn = require('cross-spawn');
var _execSync = require('child_process').execSync;
var path = require('path');
var script = process.argv[2];
var args = process.argv.slice(3);
var logger = require('../lib/util').logger;

function spawnScript(script, moreArgs) {
  const cmd = [require.resolve('../lib/scripts/' + script)].concat(args).concat(moreArgs || []);
  return spawn.sync('node', cmd, { stdio: 'inherit' });
}

function exit(result) {
  process.exit(result.status);
}

function execSync(command, options) {
  logger.bin('executing: ', command);
  return _execSync(command, options);
}
var execSyncOptions = { cwd: process.cwd(), encoding: 'utf-8' };
/*
 * This is a super opinionated way to dry node_modules from
 * different versions of react, but it should be avoided and handled
 * by dependencies definition in the user's package.json
 */
function clean() {
  execSync('(rm -rf node_modules/react-intl/node_modules/react || true)', execSyncOptions);
  execSync('(rm -rf node_modules/fixed-data-table-2/node_modules/react || true)', execSyncOptions);
  execSync('(rm -rf node_modules/revenge/node_modules/react || true)', execSyncOptions);
  execSync('rm -rf build/*', execSyncOptions);
  execSync('mkdir -p build', execSyncOptions);
}

switch (script) {
  case 'metarpheus':
  case 'metarpheus-diff':
    exit(spawnScript(script));
    break;
  case 'metarpheus-ts':
    exit(spawnScript('metarpheus', ['--ts']));
    break;
  case 'metarpheus-ts-diff':
    exit(spawnScript('metarpheus-diff', ['--ts']));
    break;
  case 'lint-style':
    exit(spawnScript('stylelint'));
    break;
  case 'lint':
    exit(spawnScript('eslint'));
    break;
  case 'stylefmt':
    exit(spawnScript('stylelint/stylefmt'));
    break;
  case 'web-dev':
    clean();
    exit(spawnScript('webpack/dev'));
    break;
  case 'web-build':
    clean();
    exit(spawnScript('webpack/build'));
    break;
  case 'web-dev-ts':
    clean();
    exit(spawnScript('webpack/dev-ts'));
    break;
  case 'web-build-ts':
    clean();
    exit(spawnScript('webpack/build-ts'));
    break;
  default:
    console.log('Unknown script "' + script + '".');
    break;
}
