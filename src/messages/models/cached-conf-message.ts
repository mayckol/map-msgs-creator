import chalk from 'chalk';
import * as fs from 'fs';
import { CONFIG_CACHE_PATH } from '../../constants';
import { IDefaultConfig, IMessageInterface } from '../../interfaces';
import { MessageAbstract } from '../message-abstract';
import { getCachedConfig } from '../message-factory';

class CachedConfMessage extends MessageAbstract {
  constructor({
    inputPath,
    outputPath,
    headerDescription,
    prettyOutput,
    incomingMessages,
    outgoingMessages,
    hashType,
  }: IMessageInterface) {
    super({
      inputPath,
      outputPath,
      headerDescription,
      prettyOutput,
      incomingMessages,
      outgoingMessages,
      hashType,
    });
  }

  async getBuildOptions(): Promise<IDefaultConfig> {
    return JSON.parse(fs.readFileSync(CONFIG_CACHE_PATH, 'utf8'));
  }

  setIncomingMessages() {
    try {
      this.defaultConf = getCachedConfig();
      this.incomingMessages = JSON.parse(
        fs.readFileSync(this.inputPath, 'utf8')
      );
    } catch (error) {
      console.log(chalk.red(error));
    }
  }

  async boot(): Promise<void> {
    console.log('Using previous configuration.');
    this.setBuildOptions(await this.getBuildOptions());
    this.setIncomingMessages();
    this.setOutgoingMessages();
    this.writeOutgoingMessages();
    this.writeCacheFile();
    this.endProcess();
  }
}

export { CachedConfMessage };
