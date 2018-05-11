import { exec as _exec } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';
import { readdir as _readdir, statSync } from 'fs';
import sortBy = require('lodash/sortBy');

const exec = promisify(_exec);
const readdir = promisify(_readdir);

const templateDir = resolve(__dirname, 'template-app');

jest.setTimeout(10 * 60 * 1000);

describe('webpack', () => {
  describe('build-ts', () => {
    beforeAll(() => {
      const commands = [
        `cd ${templateDir}`,
        'yarn',
        'rm -rf node_modules/scriptoni',
        'yarn add --no-lockfile ../../',
        'rm -rf build-ts && mkdir build-ts',
        'NODE_ENV=production ./node_modules/.bin/scriptoni web-build-ts -c ./config'
      ].join(' && ');
      return exec(commands).catch(err => {
        console.error(err);
        throw err;
      })
    });

    it('built files should stay the same', async () => {
      const fileNames = await readdir(resolve(templateDir, 'build'));
      expect(fileNames).toMatchSnapshot();
    });

    it('built files should not change size', async () => {
      const fileNames = await readdir(resolve(templateDir, 'build'));
      const fileSizes = fileNames.map(name => ({
        name, size: statSync(resolve(templateDir, 'build', name)).size
      }));
      expect(sortBy(fileSizes, 'name')).toMatchSnapshot();
    });
  });
});
