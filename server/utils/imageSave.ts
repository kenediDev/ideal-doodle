import { exec } from 'child_process';
import { Upload } from '../schema/input/userInput';
import fs from 'fs';
import path from 'path';
import { __test__ } from './env';

export const Saveimage = (filename: string, args: string, options: Upload) => {
  const direction = `../schema/assets/media/${args}/${filename}`;
  const readdir = fs.readdirSync(
    path.join(__dirname, `../schema/assets/media/${args}`)
  ); // Calculate the total file from directory

  if (readdir.length > 5) {
    if (__test__) {
      try {
        exec(`rm ${path.join(__dirname, `../schema/assets/media/${args}/*`)}`); // Remove all file from directory if file exceed 5
      } catch (err) {}
    }
  }

  options
    .createReadStream()
    .pipe(fs.createWriteStream(path.join(__dirname, direction)))
    .on('finish', () => {
      if (!__test__) {
        console.log(`Image ${args} has been save`);
      }
    })
    .on('error', (err) => {
      if (!__test__) {
        console.log(err, `Image ${args} can't be save`);
      }
    });
};
