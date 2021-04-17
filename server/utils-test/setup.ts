import 'reflect-metadata';
import { graphql } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { Connection } from 'typeorm';
import { schema } from '../config/sconfig';
import { app } from '../www';
import fs from 'fs';
import path from 'path';

const read = fs.readFileSync(
  path.join(__dirname, '../__test__/assets/requirements.json'),
  { encoding: 'utf-8' }
);

export const token = read ? JSON.parse(read)['token'] : null;
export const count = read ? JSON.parse(read)['count'] : null;
export const category = read ? JSON.parse(read)['category'] : null;

let con: Connection;

beforeAll(async () => {
  con = await app.typeormCon();
});

afterAll(async () => {
  if (con) {
    await con.close();
  }
});

interface Options {
  source: any;
  variableValues?: Maybe<{ options: any }>;
  contextValue?: any;
  rootValue?: any;
}

export const call = async ({
  source,
  variableValues,
  contextValue,
  rootValue,
}: Options) => {
  return graphql({
    schema: await schema,
    source,
    variableValues,
    contextValue,
    rootValue,
  });
};
