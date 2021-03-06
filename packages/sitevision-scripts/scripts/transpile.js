const path = require('path');
const spawn = require('cross-spawn');
const properties = require('../util/properties');
const chalk = require('chalk');
const resolveBin = require('resolve-bin');

(function () {
  const child = spawn(
    resolveBin.sync('@babel/cli', { executable: 'babel' }),
    [
      properties.SRC_DIR_PATH,
      '--out-dir',
      properties.BUILD_DIR_PATH,
      '--copy-files',
      '--config-file',
      path.resolve(__dirname, '..', 'config', 'babel-config.json'),
    ],
    {
      stdio: 'inherit',
    }
  );
  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`${chalk.red('Failed to transpile /src using babel')}`);
      process.exit(1);
    }
  });
})();
