import fs from 'fs';
import path from 'path';
import { logger } from '../../util';
import { runMetarpheusTcomb, runMetarpheusIoTs } from './run';
import getMetarpheusJSConfig from './config';
import download from './download';

const _args = process.argv.slice(2);
const ts = _args.indexOf('--ts') !== -1;
const args = _args.filter(a => a !== '--ts');

function mkDirs(filePath) {
  return new Promise((resolve, reject) => {
    fs.mkdir(filePath, (error) => {
      if (error) {
        if (error.code === 'ENOENT') {
          return mkDirs(path.dirname(filePath))
            .then(() => mkDirs(filePath))
            .then(resolve)
            .catch(reject);
        }
        else {
          reject(error);
        }
      }
      resolve();
    });
  });
}

function mkDirsIfNotExist(filePath) {
  if (!fs.existsSync(filePath)) {
    return mkDirs(filePath);
  }
  return Promise.resolve();
}

const metarpheusJSConfig = getMetarpheusJSConfig(ts);

download()
  .then(() => {
    const apiOutDir = path.dirname(metarpheusJSConfig.apiOut);
    const modelOutDir = path.dirname(metarpheusJSConfig.modelOut);

    const { model, api } = (() =>
      (ts ? runMetarpheusIoTs : runMetarpheusTcomb)(metarpheusJSConfig, args)
    )();

    // create dirs if don't exist
    mkDirsIfNotExist(apiOutDir)
      .then(() => mkDirsIfNotExist(modelOutDir))
      .then(() => {
        // write api in api output file
        logger.metarpheus(`Writing ${metarpheusJSConfig.apiOut}`);
        fs.writeFileSync(metarpheusJSConfig.apiOut, api);
        logger.metarpheus('Finished!');

        // write model in model output file
        logger.metarpheus(`Writing ${metarpheusJSConfig.modelOut}`);
        fs.writeFileSync(metarpheusJSConfig.modelOut, model);
        logger.metarpheus('Finished!');
      })
      .catch(e => {
        logger.metarpheus(e);
        process.exit(1);
      });
  });
