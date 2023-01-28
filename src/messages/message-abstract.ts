import * as fs from 'fs';
import * as readline from 'readline';
import {
  IDefaultConfig,
  IIncomingFileMessages,
  IMessageActions,
  IMessageInterface,
  IOutgoingFileMessages,
} from '../interfaces';
import { CONFIG_CACHE_PATH } from '../constants';
import chalk from 'chalk';
import { createHash, getCachedConfig } from './message-factory';
import { HashTypes } from '../types';

abstract class MessageAbstract implements IMessageInterface, IMessageActions {
  inputPath: string;
  outputPath: string;
  headerDescription: string;
  prettyOutput: boolean;
  incomingMessages: IIncomingFileMessages[];
  outgoingMessages: IOutgoingFileMessages;
  defaultConf: IDefaultConfig;
  hashType: HashTypes;
  readonly rl: readline.Interface;
  warnings: string[] = [];

  constructor({
    inputPath,
    outputPath,
    headerDescription = 'This file is auto-generated. Do not edit.',
    prettyOutput = false,
  }: IMessageInterface) {
    this.inputPath = inputPath;
    this.outputPath = outputPath;
    this.headerDescription = headerDescription;
    this.prettyOutput = prettyOutput;
    this.incomingMessages = [];
    this.outgoingMessages = {};
    this.hashType = 'md5';
    this.defaultConf = this.getDefaults();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.warnings = [];
  }

  abstract setIncomingMessages(): void;

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
    };
  }

  setBuildOptions(buildOptions: IDefaultConfig) {
    if (!buildOptions?.inputPath) {
      console.log('Error: input path is not defined.');
      return;
    }
    const { inputPath, outputPath, headerDescription, prettyOutput, hashType } =
      buildOptions;
    this.inputPath = inputPath;
    this.outputPath = outputPath;
    this.headerDescription = headerDescription;
    this.prettyOutput = prettyOutput;
    this.hashType = hashType;
  }

  handleError(error: any) {
    console.log(
      chalk.red(`Messages Creator has finished with error: ${error}`)
    );
  }

  setOutgoingMessages() {
    if (!this.incomingMessages) {
      return;
    }
    this.incomingMessages.forEach(({ input, output }) => {
      const hash = this.setHash(input);
      this.outgoingMessages[hash] = output;
    });
  }

  protected writeOutgoingMessages() {
    if (!this.outgoingMessages || !Object.keys(this.outgoingMessages).length) {
      return;
    }
    const outputMessages = this.prettyOutput
      ? JSON.stringify(this.outgoingMessages, null, 2)
      : JSON.stringify(this.outgoingMessages);
    const contentFile = `// ${this.headerDescription}
// Last updated: ${new Date().toLocaleTimeString()}
  
const outputMessages = ${outputMessages};\n
export { outputMessages };`;

    fs.writeFileSync(this.outputPath, contentFile);
  }

  protected writeCacheFile() {
    const contentFile = `{
  "inputPath": "${this.inputPath}",
  "outputPath": "${this.outputPath}",
  "headerDescription": "${this.headerDescription}",
  "prettyOutput": "${this.prettyOutput}",
  "hashType": "${this.hashType}"
}`;
    fs.writeFileSync(CONFIG_CACHE_PATH, contentFile);
  }
  private setHash(key: string): string {
    if (!key) {
      console.log('Please provide a key as a command line argument.');
      return '';
    }
    return createHash(this.hashType, key);
  }

  endProcess(): void {
    console.log(
      chalk.blueBright('\nThe file was created successfully: ') +
        getCachedConfig()?.outputPath
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
