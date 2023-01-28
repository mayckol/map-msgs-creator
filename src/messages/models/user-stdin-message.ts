import * as fs from 'fs';

import { CONFIG_CACHE_PATH } from '../../constants';
import { getUserEntries } from '../../user-input';
import { MessageAbstract } from '../message-abstract';
import { IDefaultConfig, IMessageInterface } from '../../interfaces';
import { getCachedConfig } from '../message-factory';
import { ExceptionChangeInputType } from '../../types';

class UserStdinMessage extends MessageAbstract {
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
    try {
      if (fs.existsSync(CONFIG_CACHE_PATH)) {
        const config = getCachedConfig();
        let answer = 'n';
        if (config.inputPath || config.outputPath || config.headerDescription) {
          console.log(`A configuration file was found.\n`);
          console.log(getCachedConfig());
          console.log('\n');
          answer = await new Promise((resolve) => {
            this.rl.question(
              `Do you want to use the previous configuration? (Y/n): \n`,
              resolve
            );
          });
        }
        if (answer.toLowerCase() === 'n') {
          return await getUserEntries(this.rl);
        } else {
          const data = fs.readFileSync(CONFIG_CACHE_PATH, 'utf8');

          const exception: ExceptionChangeInputType = {
            type: 'user-cache',
            config: JSON.parse(data),
          };
          throw exception;
        }
      }
      return await getUserEntries(this.rl);
    } catch (exception) {
      throw exception;
    } finally {
      this.rl.close();
    }
  }

  setIncomingMessages() {
    try {
      this.incomingMessages = JSON.parse(
        fs.readFileSync(this.inputPath, 'utf8')
      );
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  async boot(): Promise<void> {
    try {
      await this.getBuildOptions().then((config) => {
        this.setBuildOptions(config);
        this.setIncomingMessages();
        this.setOutgoingMessages();
        this.writeOutgoingMessages();
        this.writeCacheFile();
        this.endProcess();
      });
    } catch (error) {
      const { type, config } = error as ExceptionChangeInputType;
      if (type === 'user-cache') {
        this.setBuildOptions(getCachedConfig());
        this.setIncomingMessages();
        this.setOutgoingMessages();
        this.writeOutgoingMessages();
        this.writeCacheFile();
        this.endProcess();
      }
    }
  }
}

export { UserStdinMessage };
