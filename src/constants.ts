import * as path from 'path';
const ALLOWED_CHARACTERS = new Set(
  'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ0123456789'
);

const CONFIG_CACHE_PATH = path.resolve(process.cwd(), 'mmcconfig.json');

export { ALLOWED_CHARACTERS, CONFIG_CACHE_PATH };
