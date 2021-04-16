import 'reflect-metadata';
import { graphql } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { Connection } from 'typeorm';
import { schema } from '../config/sconfig';
import { app } from '../www';
import { UserEntity } from '../typeorm/entity/UserEntity';
import fs from 'fs';
import path from 'path';

let con: Connection;

beforeAll(async () => {
  con = await app.typeormCon();
  const check = await UserEntity.createQueryBuilder().getCount();
  if (!check) {
    fs.writeFileSync(
      path.join(__dirname, '../__test__/assets/requirements.json'),
      JSON.stringify({
        count: 0,
        token: '',
      })
    );
  }
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
