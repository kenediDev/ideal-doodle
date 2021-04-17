import { call } from '../utils-test/setup';
import { gql } from 'graphql-request';
import faker from 'faker';
import { UserEntity } from '../typeorm/entity/UserEntity';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { app } from '../www';

const read = fs.readFileSync(
  path.join(__dirname, './assets/requirements.json'),
  { encoding: 'utf-8' }
);

export const token = read ? JSON.parse(read)['token'] : null;
export const count = read ? JSON.parse(read)['count'] : null;

const Queryalls = gql`
  query {
    allUser {
      status
      statusCode
      results {
        username
        email
        password
        createAt
      }
    }
  }
`;

const queryDetail = gql`
  query detailUser($options: String!) {
    detailUser(options: $options) {
      status
      statusCode
      user {
        username
        email
        password
        createAt
      }
    }
  }
`;

const mutationCreate = gql`
  mutation createUser($options: CreateUserInput!) {
    createUser(options: $options) {
      status
      statusCode
      message
    }
  }
`;

const mutationLogin = gql`
  mutation login($options: LoginInput!) {
    login(options: $options) {
      status
      statusCode
      token
    }
  }
`;

const queryMe = gql`
  query {
    me {
      status
      statusCode
      user {
        username
        email
        password
        createAt
      }
    }
  }
`;

const mutationReset = gql`
  mutation reset($options: ResetInput!) {
    reset(options: $options) {
      status
      statusCode
      message
    }
  }
`;

const mutationUpdateAccounts = gql`
  mutation updateAccounts($options: UpdateAccountsInput!) {
    updateAccounts(options: $options) {
      status
      statusCode
      message
    }
  }
`;

const mutationPassword = gql`
  mutation password($options: passwordInput!) {
    password(options: $options) {
      status
      statusCode
      message
    }
  }
`;

describe('User Tester', () => {
  test('Create', async (done) => {
    const calls = await call({
      source: mutationCreate,
      variableValues: {
        options: {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: 'Password',
          confirm_password: 'Password',
        },
      },
    });
    const T = await UserEntity.createQueryBuilder().getCount();
    fs.writeFileSync(
      path.join(__dirname, './assets/requirements.json'),
      JSON.stringify({
        count: T,
        token: '',
      })
    );
    expect(calls.data).toEqual({
      createUser: {
        status: 'Ok',
        statusCode: 201,
        message: 'Accounts has been created',
      },
    });
    return done();
  });

  if (count) {
    test('Login', async (done) => {
      const user = await UserEntity.createQueryBuilder()
        .orderBy('createAt', 'DESC')
        .getOne();
      const calls = await call({
        source: mutationLogin,
        variableValues: {
          options: {
            token: user.username,
            password: 'Password',
          },
        },
      });
      fs.writeFileSync(
        path.join(__dirname, './assets/requirements.json'),
        JSON.stringify({
          count: count,
          token: calls.data.login.token,
        })
      );
      expect(calls.data.login.status).toEqual('Ok');
      expect(calls.data.login.statusCode).toEqual(200);
      return done();
    });

    test('reset', async (done) => {
      const user = await UserEntity.findOne();
      const calls = await call({
        source: mutationReset,
        variableValues: {
          options: {
            token: user.username,
          },
        },
      });
      expect(calls.data).toEqual({
        reset: {
          status: 'Ok',
          statusCode: 200,
          message: 'Accounts has been reset',
        },
      });
      return done();
    });
  } else {
    test.skip('Not have user', async (done) => {
      expect(20 * 10).toEqual(200);
      return done();
    });
  }

  describe('Authorizated', () => {
    if (token) {
      test('All', async (done) => {
        const calls = await call({
          source: Queryalls,
          contextValue: {
            user: jwt.decode(token),
          },
        });
        expect(calls.data.allUser.status).toEqual('Ok');
        expect(calls.data.allUser.statusCode).toEqual(200);
        expect(calls.data).toEqual({
          allUser: {
            status: 'Ok',
            statusCode: 200,
            results: calls.data.allUser.results,
          },
        });
        return done();
      });

      test('Detail', async (done) => {
        const detail = await UserEntity.createQueryBuilder()
          .orderBy('createAt', 'DESC')
          .getOne();
        const calls = await call({
          source: queryDetail,
          variableValues: {
            options: detail.id,
          },
          contextValue: {
            user: jwt.decode(token),
          },
        });
        expect(calls.data).toEqual({
          detailUser: {
            status: 'Ok',
            statusCode: 200,
            user: calls.data.detailUser.user,
          },
        });
        return done();
      });

      test('Me', async (done) => {
        const calls = await call({
          source: queryMe,
          contextValue: {
            user: jwt.decode(token),
          },
        });
        expect(calls.data.me.status).toEqual('Ok');
        expect(calls.data.me.statusCode).toEqual(200);
        expect(calls.data.me.user).not.toEqual(null);
        expect(calls.data.me.user.username.length).not.toEqual(null);
        return done();
      });

      test('Update Password', async (done) => {
        const calls = await call({
          source: mutationPassword,
          variableValues: {
            options: {
              old_password: 'Password',
              new_password: 'Password',
              confirm_password: 'Password',
            },
          },
          contextValue: {
            user: jwt.decode(token),
          },
        });
        expect(calls.data).toEqual({
          password: {
            status: 'Ok',
            statusCode: 200,
            message: 'Password has been updated',
          },
        });
        return done();
      });
    } else {
      test.skip('Not have token', async (done) => {
        expect(1 + 1).toBe(2);
        return done();
      });
    }
  });
  describe('User Tester Unauthorizated (Failed)', () => {
    test('All', async (done) => {
      const calls = await call({
        source: Queryalls,
      });
      expect(calls.data).toEqual(null);
      expect(calls.errors[0].message).toEqual(
        "Cannot read property 'user' of undefined"
      );
      return done();
    });
    if (count) {
      test('Detail', async (done) => {
        const user = await UserEntity.findOne();
        const calls = await call({
          source: queryDetail,
          variableValues: {
            options: user.id,
          },
        });
        expect(calls.errors[0].message).toEqual(
          "Cannot read property 'user' of undefined"
        );
        expect(calls.data).toEqual(null);
        return done();
      });

      test('Me', async (done) => {
        const calls = await call({
          source: queryMe,
        });
        expect(calls.errors[0].message).toEqual(
          "Cannot read property 'user' of undefined"
        );
        expect(calls.data).toEqual(null);
        return done();
      });
    } else {
      test.skip('Not have user', async (done) => {
        expect(1 + 1).toBe(2);
        return done();
      });
    }
  });
  describe('Accounts', () => {
    if (token) {
      test('Update', async (done) => {
        const calls = await call({
          source: mutationUpdateAccounts,
          variableValues: {
            options: {
              first_name: faker.name.firstName(),
              last_name: faker.name.lastName(),
              country: faker.address.country(),
              province: faker.address.state(),
              city: faker.address.city(),
              address: faker.address.streetAddress(),
            },
          },
          contextValue: {
            user: jwt.decode(token),
          },
        });
        expect(calls.data.updateAccounts.status).toEqual('Ok');
        expect(calls.data.updateAccounts.statusCode).toEqual(200);
        expect(calls.data).toEqual({
          updateAccounts: {
            status: 'Ok',
            statusCode: 200,
            message: 'Accounts has been updated',
          },
        });
        return done();
      });

      test('Update Avatar', async (done) => {
        await supertest(app.app)
          .post('/graphql')
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'multipart/form-data')
          .field(
            'operations',
            '{"query": "mutation updateAvatar($file: Upload!) { updateAvatar(file: $file) { message }}"}'
          )
          .field('map', '{"0": ["variables.file"]}')
          .attach(
            '0',
            path.join(
              __dirname,
              './assets/17359247_417067498626677_9219998601191355511_o.jpeg'
            )
          )
          .then((res) => {
            expect(res.body.data).toEqual({
              updateAvatar: {
                message: 'Profile has been updated',
              },
            });
            return done();
          });
      });
    } else {
      test('User not have data', async (done) => {
        expect(2 + 2).toEqual(4);
        return done();
      });
    }
  });
});
