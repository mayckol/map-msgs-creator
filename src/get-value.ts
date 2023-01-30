import * as fs from 'fs';
import { CONFIG_CACHE_PATH } from './constants';
import { createHash } from './messages/message-factory';

import { HashTypes, IDefaultConfig } from './types';

export type valueByText = (text: string) => string;
export const getValue: valueByText = (text: string): string => {
  if (!text) {
    console.log('Please provide a key as a command line argument.');
    return '';
  }
  let { hashType } = { hashType: '' };
  let path = '';
  try {
    const data = fs.readFileSync(CONFIG_CACHE_PATH, 'utf8');
    const config = JSON.parse(data) as IDefaultConfig;
    hashType = config.hashType;
    path = config.chosenLanguage || '';
  } catch (err) {
    console.error(
      `Error reading or parsing file at ${CONFIG_CACHE_PATH}: ${err}`
    );
    console.log('Please run the command with the --init flag first');
    return '';
  }
  try {
    const hashedKey = createHash(hashType as HashTypes, text);
    const { outputMessages } = require(path);
    for (const message of outputMessages) {
      if (message[hashedKey]) {
        return message[hashedKey];
      }
    }
    console.log(`No value found for key ${text}`);
    return '';
  } catch (err) {
    console.error(`Error reading or parsing file at ${path}: ${err}`);
    return '';
  }
};
