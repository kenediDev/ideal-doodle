import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { Connection, createConnection } from 'typeorm';
import { __process__, __test__ } from '../utils/env';
import Con from '../config/tconfig';
import { ApolloServer } from 'apollo-server-express';
import { schema, UserDecode } from '../config/sconfig';
import { useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';
import path from 'path';
var bodyParser = require('body-parser');
import exJWT from 'express-jwt';
import { secretsToken } from '../utils/secrets';
import { ApolloContext } from '../utils/apolloContext';
import { Transpoter } from '../utils/transpoter';

class App {
  public app: express.Application = express();
  private port: number = parseInt(__process__.port) || 8000;
  private host: string = __process__.host || '127.0.0.1';
  private loggerDB = (args: any, kwargs: any) => {
    if (!__test__) {
      console.log(args, kwargs);
    }
  };

  constructor() {
    this.extensions();
    if (!__test__) {
      this.app.use(
        '/static',
        express.static(path.join(__dirname, '../assets/media'))
      );
      this.listen();
    }
  }

  public async extensions() {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    const trans = await Transpoter();
    if (!__test__) {
      trans.verify((err, res) => {
        if (err) return console.log(err);
        console.log('SMTP has been connection');
      });
    }
    this.app.use(
      exJWT({
        secret: secretsToken,
        credentialsRequired: false,
        algorithms: ['RS256'],
        getToken: function fromHeaderOrQueryString(req) {
          if (
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer'
          ) {
            return req.headers.authorization.split(' ')[1];
          } else if (req.query && req.query.token) {
            return req.query.token;
          }
          return null;
        },
      })
    );
    useContainer(Container);
    this.typeormCon();
  }

  public async typeormCon(): Promise<Connection> {
    return createConnection(Con)
      .then(async (con) => {
        this.loggerDB('Has been connection to DB', true);
        this.apollo(con);
        return con;
      })
      .catch(async (err) => {
        this.loggerDB(err, false);
        return err;
      });
  }

  public async apollo(con: Connection) {
    const apx = new ApolloServer({
      schema: await schema,
      context: async ({ req, res }): Promise<ApolloContext<UserDecode>> => {
        return {
          req,
          res,
          user: req.user as UserDecode,
        };
      },
    });

    apx.applyMiddleware({ app: this.app });
  }

  public listen() {
    this.app.listen(this.port, this.host, () => {
      console.log('Runnning application ' + this.port);
    });
  }
}

export const app = new App();
