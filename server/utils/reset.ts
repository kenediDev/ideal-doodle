import fs from 'fs';
import path from 'path';
import { app } from '../www';
import { exec } from 'child_process';
var cowsay = require('cowsay');

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

try {
  const dir = ['author', 'category', 'product'];
  for (let i = 0; i < dir.length; i++) {
    const d = dir[i];
    console.log(`[√] remove all file from ${d}`);
    const paths = path.join(__dirname, `../schema/assets/media/${d}/*`);
    exec(`rm ${paths}`);
  }
  console.log(
    cowsay.say({
      text: 'Yeah you successfully remove all file, this is cool',
      e: 'oO',
      T: 'U ',
    })
  );
} catch (err) {}

app.typeormCon();

console.log('Reset has been successfully');
