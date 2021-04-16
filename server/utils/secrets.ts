import fs from 'fs';
import path from 'path';

export const secretsToken = fs.readFileSync(
  path.join(__dirname, '../key/jwtRS256.key'),
  { encoding: 'utf-8' }
);
