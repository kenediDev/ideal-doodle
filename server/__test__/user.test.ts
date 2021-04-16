import { call } from '../utils-test/setup';
import { gql } from 'graphql-request';
import faker from 'faker';
import { UserEntity } from '../typeorm/entity/UserEntity';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

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
    expect(calls.data).toEqual({
      createUser: {
        status: 'Ok',
        statusCode: 201,
        message: 'Accounts has been created',
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
});
