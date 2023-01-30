import * as fs from 'fs';
import * as crypto from 'crypto';

import { CONFIG_CACHE_PATH } from '../constants';
import { IDefaultConfig } from '../interfaces';
import { MessageAbstract } from './message-abstract';
import { CachedConfMessage } from './models/cached-conf-message';
import { UserStdinMessage } from './models/user-stdin-message';
import { HashTypes, MessageBuildTypes } from '../types';

const messageFactory = (type: MessageBuildTypes): MessageAbstract => {
  switch (type) {
    case 'USER_CONF_CACHE':
      return new CachedConfMessage({
        headerDescription: '',
        prettyOutput: false,
        filePaths: [],
        outgoingMessages: {},
        hashType: 'md5',
        incomingMessages: {},
      });
    case 'USER_STDIN':
      return new UserStdinMessage({
        headerDescription: '',
        prettyOutput: false,
        outgoingMessages: {},
        hashType: 'md5',
        filePaths: [],
        incomingMessages: {},
      });
    default:
      throw new Error("Message type doesn't exist");
  }
};

const createHash = (hashType: HashTypes, key: string): string => {
  return crypto.createHash(hashType).update(key).digest('hex');
};

const getCachedConfig = (): IDefaultConfig => {
  const data = fs.readFileSync(CONFIG_CACHE_PATH, 'utf8');
  return JSON.parse(data);
};

export { messageFactory, getCachedConfig, createHash };
