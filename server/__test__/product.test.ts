import { gql } from 'graphql-request';
import { call, category, token } from '../utils-test/setup';
import faker from 'faker';
import supertest from 'supertest';
import { app } from '../www';
import { CategoryEntity } from '../typeorm/entity/CategoryEntity';
import path from 'path';

const queryAll = gql`
  query {
    allProduct {
      status
      statusCode
      results {
        id
        name
        photo
        sell
        promo
        agent
        description
        status
        category {
          name
          icon
        }
        author {
          accounts {
            first_name
            last_name
            avatar
            location {
              country
              province
              city
              address
            }
          }
        }
        createAt
        updateAt
      }
    }
  }
`;

describe('Product', () => {
  test('All', async (done) => {
    const calls = await call({
      source: queryAll,
    });
    expect(calls.data).toEqual({
      allProduct: {
        status: 'Ok',
        statusCode: 200,
        results: calls.data.allProduct.results,
      },
    });
    return done();
  });

  if (token && category) {
    test('Create', async (done) => {
      const category = await CategoryEntity.createQueryBuilder()
        .orderBy('createAt', 'DESC')
        .getOne();
      await supertest(app.app)
        .post('/graphql')
        .type('form')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${token}`)
        .field(
          'operations',
          `{"query": "mutation createProduct($file: Upload!, $name: String!, $sell: String!, $promo: String!, $agent: String!, $description: String!, $category: String!) { createProduct(options: {name: $name, photo: $file, sell: $sell, promo: $promo, agent: $agent, description: $description, category: $category}) { message } }", "variables": {"file": null, "name": "${faker.name.title()}", "sell": "${faker.datatype.float(
            90000
          )}", "promo": "${faker.datatype.float(
            90000
          )}", "description": "${faker.lorem.paragraph()}", "category": "${
            category.id
          }", "agent": "${faker.datatype.float(90000)}"}}`
        )
        .field('map', '{"file": ["variables.file"]}')
        .attach(
          'file',
          path.join(
            __dirname,
            './assets/17359247_417067498626677_9219998601191355511_o.jpeg'
          )
        )
        .expect(200)
        .then((res) => {
          expect(res.body.data).toEqual({
            createProduct: {
              message: 'Product has been created',
            },
          });
          return done();
        });
    });
  } else {
    test.skip('Skip not have user or category product', async (done) => {
      expect(2 + 2).toBe(4);
      return done();
    });
  }
});
