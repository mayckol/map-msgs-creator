import { HashTypes } from './types';

interface IIncomingFileMessages {
  input: string;
  output: string;
}

interface IOutgoingMessages {
  [key: string]: string;
}

interface IOutgoingFileMessages {
  [key: string]: IOutgoingMessages[];
}

interface ICreator {
  type: 'cache' | 'user-input';
  inputPath: string;
  outputPath: string;
  headerDescription?: string;
  prettyOutput?: boolean;
  incomingMessages?: IFilePaths[];
  outgoingMessages?: IOutgoingFileMessages;
  useCache?: boolean;
}

interface IFilePaths {
  inputPath: string;
  outputPath: string;
}

interface IDefaultConfig {
  headerDescription: string;
  hashType: HashTypes;
  prettyOutput: boolean;
  filePaths: IFilePaths[];
  chosenLanguage?: string;
}

interface Argv {
  keepConf: boolean;
  k: boolean;
}

interface IMessageInterface {
  headerDescription?: string;
  prettyOutput?: boolean;
  hashType: HashTypes;
  outgoingMessages?: IOutgoingFileMessages;
  filePaths: IFilePaths[];
  incomingMessages: IOutgoingFileMessages;
  chosenLanguage?: string;
}

interface IMessageActions {
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
  IFilePaths,
  Argv,
  IOutgoingFileMessages,
  IIncomingFileMessages,
};
