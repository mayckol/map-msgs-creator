import { HashTypes } from './types';

interface IIncomingFileMessages {
  input: string;
  output: string;
}

interface IOutgoingFileMessages extends Record<string, string> {
  [key: string]: string;
}

interface ICreator {
  type: 'cache' | 'user-input';
  inputPath: string;
  outputPath: string;
  headerDescription?: string;
  prettyOutput?: boolean;
  incomingMessages?: IIncomingFileMessages[];
  outgoingMessages?: IOutgoingFileMessages;
  useCache?: boolean;
}

interface IDefaultConfig {
  inputPath: string;
  outputPath: string;
  headerDescription: string;
  hashType: HashTypes;
  prettyOutput: boolean;
}

interface Argv {
  keepConf: boolean;
  k: boolean;
}

interface IMessageInterface {
  inputPath: string;
  outputPath: string;
  headerDescription?: string;
  prettyOutput?: boolean;
  hashType: HashTypes;
  incomingMessages?: IIncomingFileMessages[];
  outgoingMessages?: IOutgoingFileMessages;
}

interface IMessageActions {
  setIncomingMessages(): void;
  setOutgoingMessages(): void;
  getBuildOptions(): Promise<IDefaultConfig>;
  handleError(error: any): void;
  boot(): Promise<void>;
}

export {
  IMessageInterface,
  IMessageActions,
  ICreator,
  IDefaultConfig,
  Argv,
  IIncomingFileMessages,
  IOutgoingFileMessages,
};
