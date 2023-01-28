import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import chalk from 'chalk';
import { IDefaultConfig } from './interfaces';
import { HashTypes } from './types';

const getInputPath = (rl: readline.Interface): Promise<string> => {
  return new Promise((resolve, reject) => {
    rl.question(
      chalk.yellow(
        'Enter the input file absolute path like:\n/Users/CoreyTaylor/Development/awesome-project/src/i18n/input.json (the extension is optional).\n'
      ),
      (inputPath: string) => {
        fs.access(inputPath, fs.constants.F_OK, (err) => {
          if (err) {
            reject(new Error(`The file ${inputPath} does not exist.\n`));
          }
          resolve(inputPath);
        });
      }
    );
  });
};

const getOutputPath = (rl: readline.Interface): Promise<string> => {
  return new Promise((resolve, reject) => {
    rl.question(
      chalk.yellow(
        'Enter the output file absolute path\n/Users/CoreyTaylor/Development/awesome-project/src/i18n/output.(ts/js) (the extension is required).\n'
      ),
      (outputPath: string) => {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          reject(new Error(`The directory ${dir} does not exist \n`));
        }
        resolve(outputPath);
      }
    );
  });
};

const getHeaderDescription = (rl: readline.Interface): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(
      chalk.yellow(
        'Enter the header description (optional) (Default is: "This file is auto-generated. Do not edit."): \n'
      ),
      (headerDescription: string) => {
        if (headerDescription === '') {
          headerDescription = 'This file is auto-generated. Do not edit.';
        }
        resolve(headerDescription);
      }
    );
  });
};

const getPrettyOutput = (rl: readline.Interface): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(
      chalk.yellow('Do you want pretty-printed output? (y/N): \n'),
      (prettyOutput: string) => {
        resolve(prettyOutput);
      }
    );
  });
};

const getHashType = (rl: readline.Interface): Promise<HashTypes> => {
  return new Promise((resolve) => {
    let hashType: HashTypes = 'md5';
    console.log('Select the hash type: ');
    console.log(chalk.white('1)') + ' ' + chalk.green('md5 (default)'));
    console.log('2) sha1');
    console.log('3) sha256');
    rl.question(
      chalk.yellow('Enter the number of the option: \n'),
      (option: string) => {
        if (option === '2') {
          hashType = 'sha1';
        } else if (option === '3') {
          hashType = 'sha256';
        }
        resolve(hashType);
      }
    );
  });
};

const getUserEntries = async (
  rl: readline.Interface
): Promise<IDefaultConfig> => {
  const inputPath = await getInputPath(rl);
  const outputPath = await getOutputPath(rl);
  const headerDescription = await getHeaderDescription(rl);
  const hashType = await getHashType(rl);
  const prettyOutput = (await getPrettyOutput(rl)) === 'y' ? true : false;
  return { inputPath, outputPath, headerDescription, hashType, prettyOutput };
};

export { getUserEntries };
