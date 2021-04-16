import { createConnection } from 'typeorm';
import { pathDB, typeName, __process__, __test__ } from '../utils/env';
import path from 'path';

export default {
  type: typeName,
  username: __process__.db_user,
  password: __process__.db_pass,
  database: pathDB,
  synchronize: true,
  dropSchema: false,
  logging: false,
  migrations: [path.join(__dirname, '../typeorm/migrations/*.ts')],
  subscribers: [path.join(__dirname, '../typeorm/subscribers/*.ts')],
  entities: [path.join(__dirname, '../typeorm/entity/*.ts')],
  cli: [
    path.join(__dirname, '../typeorm/entity'),
    path.join(__dirname, '../typeorm/subscribers'),
    path.join(__dirname, '../typeorm/migrations'),
  ],
} as Parameters<typeof createConnection>[0];
