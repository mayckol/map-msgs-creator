import chalk from 'chalk';
import * as fs from 'fs';
import { CONFIG_CACHE_PATH } from './constants';
import { createHash } from './messages/message-factory';

import { HashTypes } from './types';

export type valueByText = (text: string) => string;
export const getValueByText: valueByText = (text: string): string => {
  if (!text) {
    console.log('Please provide a key as a command line argument.');
    return '';
  }
  let { hashType, outputPath } = { hashType: '', outputPath: '' };
  try {
    const data = fs.readFileSync(CONFIG_CACHE_PATH, 'utf8');
    const config = JSON.parse(data);
    hashType = config.hashType;
    outputPath = config.outputPath;
  } catch (err) {
    console.error(
      `Error reading or parsing file at ${CONFIG_CACHE_PATH}: ${err}`
    );
    console.log(chalk.red('Please run the command with the --init flag first'));
    return '';
  }
  try {
    const hashedKey = createHash(hashType as HashTypes, text);
    console.log({ hashedKey, text });

    const { outputMessages } = require(outputPath);
    if (!outputMessages[hashedKey]) {
      console.log('The key is not valid');
      return '';
    }
    return outputMessages[hashedKey];
  } catch (err) {
    console.error(`Error reading or parsing file at ${outputPath}: ${err}`);
    return '';
  }
};
getValueByText(
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
);
