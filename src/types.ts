import {
  IDefaultConfig,
  IFilePaths,
  IOutgoingFileMessages,
} from './interfaces';

const MESSAGE_BUILD_TYPES = {
  USER_STDIN: 'USER_STDIN',
  USER_CONF_CACHE: 'USER_CONF_CACHE',
} as const;

const HASH_TYPES = {
  MD5: 'md5',
  SHA1: 'sha1',
  SHA256: 'sha256',
} as const;

type ObjectValues<T> = T[keyof T];
type MessageBuildTypes = ObjectValues<typeof MESSAGE_BUILD_TYPES>;
type HashTypes = ObjectValues<typeof HASH_TYPES>;

interface IMessage {
  headerDescription?: string;
  prettyOutput?: boolean;
  incomingMessages?: IFilePaths[];
  outgoingMessages?: IOutgoingFileMessages;
}

interface ExceptionChangeInputType {
  type: 'user-cache';
  config: IDefaultConfig;
}

export * from './interfaces';

export { MessageBuildTypes, IMessage, ExceptionChangeInputType, HashTypes };
