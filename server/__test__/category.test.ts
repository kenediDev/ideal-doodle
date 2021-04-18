import { gql } from 'graphql-request';
import { call, category, token } from '../utils-test/setup';
import faker from 'faker';
import jwt from 'jsonwebtoken';
import { CategoryEntity } from '../typeorm/entity/CategoryEntity';
import supertest from 'supertest';
import { app } from '../www';
import path from 'path';
import { UserDecode } from '../config/sconfig';

interface CategoryUser {
  categoryId: string;
  userId: string;
}

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

const mutationDestroy = gql`
  mutation destroyCategory($options: String!) {
    destroyCategory(options: $options) {
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
      const name = faker.name.title().toString();
      await supertest(app.app)
        .post('/graphql')
        .type('form')
        .set('Content-Type', 'multipart/form-data')
        .set('Authorization', `Bearer ${token}`)
        .field(
          'operations',
          `{"query": "mutation createCategory($file: Upload!, $name: String!) { createCategory(options: {file: $file,name: $name}) { message }}", "variables": {"file": null, "name": "${name}"} }`
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
            createCategory: {
              message: 'Category has been created',
            },
          });
          return done();
        });
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
      const tokens = jwt.decode(token);
      const T = tokens as UserDecode;
      const categorys = await CategoryEntity.query(
        `select category.id as categoryId from category left join user on user.id = category.authorId where user.username = "${T.user.username}" limit 1`
      );
      const _ = categorys as CategoryUser[];
      const calls = await call({
        source: mutationUpdate,
        variableValues: {
          options: {
            id: _[0].categoryId,
            name: faker.name.title() + 'Update',
          },
        },
        contextValue: {
          user: tokens,
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

    test('Update Icon', async (done) => {
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
          `{"query": "mutation updateIconCategory($file: Upload!, $id: String!) { updateIconCategory(options: {file: $file, id: $id}) { message } }", "variables": {"file": null, "id": "${category.id}"}}`
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
            updateIconCategory: {
              message: 'Icon has been updated',
            },
          });
          return done();
        });
    });
    test('Destroy', async (done) => {
      const tokens = jwt.decode(token);
      const user = tokens as UserDecode;
      const categorys = await CategoryEntity.query(
        `select category.id as categoryId  from category left join user on user.id = category.authorId where user.username = "${user.user.username}" limit 1`
      );
      const id = categorys[0].categoryId;
      const calls = await call({
        source: mutationDestroy,
        variableValues: {
          options: id,
        },
        contextValue: {
          user: tokens,
        },
      });
      expect(calls.data).toEqual({
        destroyCategory: {
          status: 'Ok',
          statusCode: 200,
          message: 'Category has been deleted',
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

  describe('Category Failed', () => {
    if (token && category) {
      test('Create (Name category already exists, please check again)', async (done) => {
        const category = await CategoryEntity.findOne();
        await supertest(app.app)
          .post('/graphql')
          .type('form')
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization', `Bearer ${token}`)
          .field(
            'operations',
            `{"query": "mutation createCategory($file: Upload!, $name: String!) { createCategory(options: {file: $file,name: $name}) { message }}", "variables": {"file": null, "name": "${category.name}"} }`
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
            const _ = JSON.parse(res.text);
            expect(_.errors[0].message).toEqual(
              'Name category already exists, please check again'
            );
            return done();
          });
      });

      test('Update (You not have this access!)', async (done) => {
        const categorys = await CategoryEntity.findOne();
        const calls = await call({
          source: mutationUpdate,
          variableValues: {
            options: {
              id: categorys.id,
              name: faker.name.title() + 'Update',
            },
          },
          contextValue: {
            user: jwt.decode(token),
          },
        });
        expect(calls.errors[0].message).toEqual('You not have this access!');
        return done();
      });
      test('Destroy (You not have this access!)', async (done) => {
        const category = await CategoryEntity.findOne();
        const calls = await call({
          source: mutationDestroy,
          variableValues: {
            options: category.id,
          },
          contextValue: {
            user: jwt.decode(token),
          },
        });
        expect(calls.errors[0].message).toEqual('You not have this access!');
        return done();
      });
    } else {
      test.skip('Skip Not have user for token', async (done) => {
        expect(2 + 2).toEqual(4);
        return done();
      });
    }
  });
});
