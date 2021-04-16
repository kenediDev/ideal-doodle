import 'reflect-metadata';
import { graphql } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';
import { Connection } from 'typeorm';
import { schema } from '../config/sconfig';
import { app } from '../www';

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
