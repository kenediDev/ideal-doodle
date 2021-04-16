import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const __process__ = process.env;
export const __test__ = process.env.test;
export const __prod__ = process.env.prod;
export const typeName = __test__ ? 'sqlite' : 'mysql';
export const timestamps = __test__ ? 'datetime' : 'timestamp';
export const text_ = __test__ ? 'varchar' : 'text';
export const pathDB = __test__
  ? path.join(__dirname, '../../test.sqlite')
  : __process__.db_name;
