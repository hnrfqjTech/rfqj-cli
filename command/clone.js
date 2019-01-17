/**
 * @author bigang.ybg
 * @date 2018/12/30
 */

'use strict';

const BaseCommand = require('../lib/BaseCommand');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const spinner = ora('Loading...');
const download = require('download-git-repo');
const _ = require('../lib/utils');
const baseDir = path.resolve(__dirname, '..');
const boilerplateConf = require(baseDir + '/config/boilerplate.json');

class CloneCommand extends BaseCommand {
  constructor(rawArgv) {
    super(rawArgv);

    this.yargs.usage('Usage: rfqj clone [-p=path] boilerplateName');
    this.options = {
      key: {
        alias: 'p',
        type: 'string',
        description: '存放路径，默认当前路径'
      },
    };
  }

  get description() {
    return 'clone boilerplate';
  }

  getTargetDirectory(realDir, defaultDir) {
    const dir = realDir || defaultDir;
    let targetDir = path.resolve(this.cwd, dir);
    const isValidDirectory = _.isValidDirectory(fs, targetDir, this.logger);
    if (!isValidDirectory) {
      targetDir = false;
    }
    return targetDir;
  }

  * run(props) {
    this.args = props.argv;
    this.cwd = process.cwd();
    const alias = this;
    const boilerplateName = this.args._[ 0 ] || '';
    const boilerplateUrl = boilerplateConf[ boilerplateName ];
    const targetDirectory = this.getTargetDirectory(this.args.p, boilerplateName);

    if (boilerplateUrl && targetDirectory) {
      spinner.start();
      download(`direct:${boilerplateUrl}`, targetDirectory, { clone: true },
        function(err) {
          spinner.stop();
          if (err) alias.logger.error('Failed to download repo ' + boilerplateUrl + ': ' + err.message.trim());
          else alias.logger.info(`${boilerplateName} download successful!`, 'boilerplate ->');
        }
      );
    }
  }
}

module.exports = CloneCommand;