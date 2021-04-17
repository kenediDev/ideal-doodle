import { gql } from 'graphql-request';
import { call } from '../utils-test/setup';
import faker from 'faker';
import jwt from 'jsonwebtoken';
import { token } from './user.test';

const queryCategory = gql`
  query {
    allCategory {
      status
      statusCode
      results {
        id
        name
        icon
        createAt
        updateAt
      }
    }
  }
`;

const mutationCreate = gql`
  mutation createCategory($options: CreateCategoryInput!) {
    createCategory(options: $options) {
      status
      statusCode
      message
    }
  }
`;

describe('Category', () => {
  test('all', async (done) => {
    const calls = await call({
      source: queryCategory,
    });
    expect(calls.data).toEqual({
      allCategory: {
        status: 'Ok',
        statusCode: 200,
        results: calls.data.allCategory.results,
      },
    });
    return done();
  });
  if (token) {
    test('create', async (done) => {
      const calls = await call({
        source: mutationCreate,
        variableValues: {
          options: {
            name: faker.name.title(),
          },
        },
        contextValue: {
          user: jwt.decode(token),
        },
      });
      expect(calls.data).toEqual({
        createCategory: {
          status: 'Ok',
          statusCode: 201,
          message: 'Category has been created',
        },
      });
      return done();
    });
  } else {
    test.skip('Skip Not have user for token', async (done) => {
      expect(2 + 2).toEqual(4);
      return done();
    });
  }
});
