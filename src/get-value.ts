import chalk from 'chalk';
import * as fs from 'fs';
import { CONFIG_CACHE_PATH } from './constants';
import { createHash } from './messages/message-factory';

import { HashTypes, IDefaultConfig } from './types';

export type valueByText = (text: string, lang: string) => string;
export const getValue: valueByText = (
  text: string,
  langDefaultPath: string
): string => {
  if (!text) {
    console.log('Please provide a key as a command line argument.');
    return '';
  }
  let { hashType } = { hashType: '' };
  try {
    const data = fs.readFileSync(CONFIG_CACHE_PATH, 'utf8');
    const config = JSON.parse(data) as IDefaultConfig;
    hashType = config.hashType;
  } catch (err) {
    console.error(
      `Error reading or parsing file at ${CONFIG_CACHE_PATH}: ${err}`
    );
    console.log(chalk.red('Please run the command with the --init flag first'));
    return '';
  }
  try {
    const hashedKey = createHash(hashType as HashTypes, text);
    const { outputMessages } = require(langDefaultPath);
    for (const message of outputMessages) {
      if (message[hashedKey]) {
        return message[hashedKey];
      }
    }
    throw new Error("Couldn't find the key in the file.");
  } catch (err) {
    console.error(
      `Error reading or parsing file at ${langDefaultPath}: ${err}`
    );
    return '';
  }
};

console.log(getValue('video11', '/tmp/en-us.ts'));
