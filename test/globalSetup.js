const resolve = require('path').resolve;
const _exec = require('child_process').exec;
const promisify = require('util').promisify;

const exec = promisify(_exec);

const templateDir = resolve(__dirname, 'template-app');

function runCommands(commands) {
  return exec(commands.join(' && ')).catch(err => {
    console.error(err);
    throw err;
  });
}

module.exports = () => runCommands([
  `cd ${templateDir}`,
  'yarn --no-lockfile',
  'rm -rf node_modules/scriptoni',
  'cd ../../',
  'yarn build',
  `cd ${templateDir}`,
  'yarn add --no-lockfile ../../'
]);
