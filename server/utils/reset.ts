import fs from 'fs';
import path from 'path';

fs.writeFileSync(
  path.join(__dirname, '../__test__/assets/requirements.json'),
  JSON.stringify({
    count: 0,
    token: '',
  })
);

try {
  fs.unlinkSync(path.join(__dirname, '../../test.sqlite'));
} catch (err) {}

fs.createWriteStream(path.join(__dirname, '../../test.sqlite'));

console.log('Reset has been successfully');
