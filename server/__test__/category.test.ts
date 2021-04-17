import { gql } from 'graphql-request';
import { call } from '../utils-test/setup';
import faker from 'faker';
import jwt from 'jsonwebtoken';
import { token } from './user.test';
import { CategoryEntity } from '../typeorm/entity/CategoryEntity';

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
        author {
          username
          email
          createAt
          updateAt
          accounts {
            first_name
            last_name
            updateAt
            location {
              country
              province
              city
              address
            }
          }
        }
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

const queryDetail = gql`
  query detailCategory($options: String!) {
    detailCategory(options: $options) {
      status
      statusCode
      category {
        id
        name
        icon
        createAt
        updateAt
        author {
          username
          email
          createAt
          updateAt
          accounts {
            first_name
            last_name
            updateAt
            location {
              country
              province
              city
              address
            }
          }
        }
      }
    }
  }
`;

const mutationUpdate = gql`
  mutation updateCategory($options: UpdateCategoryInput!) {
    updateCategory(options: $options) {
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

    test('detail', async (done) => {
      const category = await CategoryEntity.findOne();
      const calls = await call({
        source: queryDetail,
        variableValues: {
          options: category.id,
        },
      });
      expect(calls.data).toEqual({
        detailCategory: {
          status: 'Ok',
          statusCode: 200,
          category: calls.data.detailCategory.category,
        },
      });
      return done();
    });

    test('Update', async (done) => {
      const category = await CategoryEntity.createQueryBuilder()
        .orderBy('createAt', 'DESC')
        .getOne();
      const calls = await call({
        source: mutationUpdate,
        variableValues: {
          options: {
            id: category.id,
            name: faker.name.title() + 'Update',
          },
        },
        contextValue: {
          user: jwt.decode(token),
        },
      });
      expect(calls.data).toEqual({
        updateCategory: {
          status: 'Ok',
          statusCode: 200,
          message: 'Category has been updated',
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
