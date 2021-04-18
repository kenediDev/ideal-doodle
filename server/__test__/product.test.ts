import { gql } from 'graphql-request';
import { call, category, token } from '../utils-test/setup';
import faker from 'faker';
import supertest from 'supertest';
import { app } from '../www';
import { CategoryEntity } from '../typeorm/entity/CategoryEntity';
import path from 'path';
import jwt from 'jsonwebtoken';
import { ProductEntity } from '../typeorm/entity/ProductEntity';
import { UserEntity } from '../typeorm/entity/UserEntity';
import { secretsToken } from '../utils/secrets';

interface ProductUser {
  productId: string;
  userId: string;
}

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
          id
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

const mutationDestroy = gql`
  mutation destroyProduct($options: String!) {
    destroyProduct(options: $options) {
      status
      statusCode
      message
    }
  }
`;

const queryDetail = gql`
  mutation detailProduct($options: String!) {
    detailProduct(options: $options) {
      status
      statusCode
      product {
        id
        name
        photo
        sell
        promo
        agent
        description
        status
        category {
          id
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
          console.log(res.text);
          expect(res.body.data).toEqual({
            createProduct: {
              message: 'Product has been created',
            },
          });
          return done();
        });
    });

    test('Destory', async (done) => {
      const product = await ProductEntity.query(
        'select product.id as productId, user.id as userId from product left join user on user.id = product.authorId where user.id IS NOT NULL limit 1'
      );
      const _t = product as ProductUser[];
      const t = _t[0];
      const _ = await UserEntity.findOne({ where: { id: t.userId } });
      const newTokens = await jwt.sign({ user: _ }, secretsToken, {
        algorithm: 'RS256',
      });
      const calls = await call({
        source: mutationDestroy,
        variableValues: {
          options: t.productId,
        },
        contextValue: {
          user: jwt.decode(newTokens),
        },
      });
      expect(calls.data).toEqual({
        destroyProduct: {
          status: 'Ok',
          statusCode: 200,
          message: 'Product has been deleted',
        },
      });
      return done();
    });

    test('Detail', async (done) => {
      const product = await ProductEntity.findOne();
      const calls = await call({
        source: queryDetail,
        variableValues: {
          options: product.id,
        },
      });
      expect(calls.data).toEqual({
        detailProduct: {
          status: 'Ok',
          statusCode: 200,
          product: calls.data.detailProduct.product,
        },
      });
      return done();
    });
  } else {
    test.skip('Skip not have user or category product', async (done) => {
      expect(2 + 2).toBe(4);
      return done();
    });
  }
  describe('Product Failed', () => {
    if (token && category) {
      test('Destroy', async (done) => {
        const product = await ProductEntity.query(
          'select product.id as productId, user.id as userId from product left join user on user.id = product.authorId where user.id IS NOT NULL limit 1'
        );
        const _ = product as ProductUser[];
        const t_ = _[0];
        const calls = await call({
          source: mutationDestroy,
          variableValues: {
            options: t_.productId,
          },
          contextValue: {
            user: jwt.decode(token),
          },
        });
        expect(calls.errors[0].message).toEqual("You don't have this access!");
        return done();
      });
      test('Detail', async (done) => {
        const calls = await call({
          source: queryDetail,
          variableValues: {
            options: '1',
          },
        });
        expect(calls.errors[0].message).toEqual('Product not found');
        return done();
      });
    } else {
      test('Skip Not have token', async (done) => {
        expect(2 + 2).toBe(4);
        return done();
      });
    }
  });
});
