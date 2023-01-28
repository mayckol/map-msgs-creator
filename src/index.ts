#! /usr/bin/env node
import * as fs from 'fs';
import figlet from 'figlet';
import chalk from 'chalk';
import { Command } from 'commander';

import { CONFIG_CACHE_PATH } from './constants';
import { messageFactory } from './messages/message-factory';

function isKeepConf(): boolean {
  let keepConf = false;
  const program = new Command();
  program
    .option(
      '-k, --keep-conf',
      'Use the configuration from the last run',
      () => {
        keepConf = true;
      }
    )
    .parse(process.argv);

  if (keepConf && !fs.existsSync(CONFIG_CACHE_PATH)) {
    console.log(
      chalk.red(
        'There is no active configuration. Please run the command without the --keep-conf flag.'
      )
    );
    throw new Error('There is no active configuration.');
  }
  return keepConf;
}

try {
  const message = messageFactory(
    isKeepConf() ? 'USER_CONF_CACHE' : 'USER_STDIN'
  );
  console.log(chalk.green(figlet.textSync('MMCreator')));
  message.boot();
} catch (error) {
  console.error(error);
}
