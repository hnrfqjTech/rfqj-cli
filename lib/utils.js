'use strict';

// const child_process = require('child_process');

module.exports = {
  isValidDirectory(fs, dir, logger, force) {
    if (fs.existsSync(dir)) {
      if (!fs.statSync(dir).isDirectory()) {
        logger.error(`${dir} already exists as a file`);
        return false;
      }
      const files = fs.readdirSync(dir).filter(name => name[ 0 ] !== '.');
      if (files.length > 0) {
        if (force) {
          logger.warn(`${dir} already exists and will be override due to --force`);
        } else {
          logger.error(`${dir} already exists and not empty: ${JSON.stringify(files)}`);
          return false;
        }
      }
    }
    return true;
  }
};