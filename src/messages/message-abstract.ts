import * as fs from 'fs';
import * as readline from 'readline';
import {
  IDefaultConfig,
  IFilePaths,
  IMessageActions,
  IMessageInterface,
  IOutgoingFileMessages,
} from '../interfaces';
import { CONFIG_CACHE_PATH } from '../constants';
import chalk from 'chalk';
import { createHash, getCachedConfig } from './message-factory';
import { HashTypes } from '../types';

abstract class MessageAbstract implements IMessageInterface, IMessageActions {
  filePaths: IFilePaths[];
  chosenLanguage: string;
  headerDescription: string;
  prettyOutput: boolean;
  outgoingMessages: IOutgoingFileMessages;
  defaultConf: IDefaultConfig;
  hashType: HashTypes;
  readonly rl: readline.Interface;
  incomingMessages: IOutgoingFileMessages;
  warnings: string[] = [];

  constructor({
    headerDescription = 'This file is auto-generated. Do not edit.',
    prettyOutput = false,
    filePaths,
  }: IMessageInterface) {
    this.filePaths = filePaths;
    this.headerDescription = headerDescription;
    this.prettyOutput = prettyOutput;
    this.filePaths = [];
    this.outgoingMessages = {};
    this.hashType = 'md5';
    this.defaultConf = this.getDefaults();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.incomingMessages = {};
    this.warnings = [];
    this.chosenLanguage = '';
  }

  abstract boot(): Promise<void>;

  abstract getBuildOptions(): Promise<IDefaultConfig>;

  private getDefaults() {
    return {
      inputPath: '',
      outputPath: '',
      headerDescription:
        'This file is auto-generated. Do not edit. Last updated: ' +
        new Date().toLocaleTimeString(),
      prettyOutput: false,
      hashType: this.hashType,
      filePaths: this.filePaths,
    };
  }

  setBuildOptions(buildOptions: IDefaultConfig) {
    if (!buildOptions?.filePaths?.length) {
      console.log('Error: No file paths provided.');
      return;
    }
    const { filePaths, headerDescription, prettyOutput, hashType } =
      buildOptions;
    this.headerDescription = headerDescription;
    this.prettyOutput = prettyOutput;
    this.hashType = hashType;
    this.filePaths = filePaths;
  }

  normalizePath(path: string): string {
    return encodeURIComponent(path.replace(/[\/\\]+/g, '_'));
  }

  recoverPath(key: string): string {
    return decodeURIComponent(key).replace(/_/g, '/');
  }

  handleError(error: any) {
    console.log(
      chalk.red(`Messages Creator has finished with error: ${error}`)
    );
  }

  setOutgoingMessages() {
    Object.keys(this.incomingMessages).forEach((path) => {
      const [, outputPath] = path.split('@');
      this.outgoingMessages[outputPath] =
        this.outgoingMessages[outputPath] || [];
      this.incomingMessages[path].forEach(({ input, output }) => {
        const hashKey = createHash(this.hashType, input);
        this.outgoingMessages[outputPath].push({ [hashKey]: output });
      });
    });
  }

  protected writeOutgoingMessages() {
    if (!this.outgoingMessages || !Object.keys(this.outgoingMessages).length) {
      return;
    }
    let contentFile = '';
    Object.keys(this.outgoingMessages).forEach((path) => {
      const outputMessages = this.prettyOutput
        ? JSON.stringify(this.outgoingMessages[path], null, 2)
        : JSON.stringify(this.outgoingMessages[path]);
      contentFile = `/* eslint-disable */
// ${this.headerDescription}
// Last updated: ${new Date().toLocaleTimeString()}
  
const outputMessages = ${outputMessages};\n
export { outputMessages };`;

      fs.writeFileSync(this.recoverPath(path), contentFile);
    });
  }

  protected writeCacheFile() {
    const contentFile = JSON.stringify(
      {
        filePaths: this.filePaths,
        headerDescription: this.headerDescription,
        prettyOutput: this.prettyOutput,
        hashType: this.hashType,
        chosenLanguage: this.chosenLanguage,
      },
      null,
      2
    );
    fs.writeFileSync(CONFIG_CACHE_PATH, contentFile);
  }

  endProcess(): void {
    const outputPaths = getCachedConfig()
      ? this.filePaths.map(({ outputPath }) => outputPath).join(', ')
      : '';
    console.log(
      chalk.blueBright('\nThe file was created successfully: ') + outputPaths
    );
    if (this.warnings.length) {
      console.log(chalk.yellow('\nThe process ended with warnings: '));
      this.warnings.forEach((warning) => {
        console.log(chalk.yellow(warning));
      });
    } else {
      console.log(chalk.green('\nDone!'));
    }
    process.exit(0);
  }
}

export { MessageAbstract };
