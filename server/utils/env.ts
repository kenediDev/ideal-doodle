import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const dev = process.env.dev || false;
const sqlite = path.join(__dirname, '../../test.sqlite');

export const __process__ = process.env;
export const __test__ = process.env.test;
export const __prod__ = process.env.prod;
export const typeName = !dev ? (__test__ ? 'sqlite' : 'mysql') : 'sqlite';
export const timestamps = !dev
  ? __test__
    ? 'datetime'
    : 'timestamp'
  : 'datetime';
export const text_ = !dev ? (__test__ ? 'varchar' : 'text') : 'varchar';
export const pathDB = !dev ? (__test__ ? sqlite : __process__.db_name) : sqlite;

if (!__test__) {
  console.log({
    dbType: typeName,
    mode: dev ? 'development' : 'production',
    datetime: timestamps,
    path: pathDB,
  });
}
