import fs from 'fs';
import path from 'path';
import { app } from '../www';

fs.writeFileSync(
  path.join(__dirname, '../__test__/assets/requirements.json'),
  JSON.stringify({
    count: 0,
    token: '',
    category: 0,
  })
);

try {
  fs.unlinkSync(path.join(__dirname, '../../test.sqlite'));
} catch (err) {}

fs.createWriteStream(path.join(__dirname, '../../test.sqlite'));

app.typeormCon();

console.log('Reset has been successfully');
