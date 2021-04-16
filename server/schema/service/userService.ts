import { Service } from 'typedi';
import { Connection } from 'typeorm';
import { InjectConnection } from 'typeorm-typedi-extensions';
import { AccountsEntity } from '../../typeorm/entity/AccountsEntity';
import { UserEntity } from '../../typeorm/entity/UserEntity';
import {
  CreateUserInput,
  UpdateAccountsInput,
  Upload,
} from '../input/userInput';
import { UserQueryResponse } from '../query/userQuery';
import fs from 'fs';
import path from 'path';
import { __test__ } from '../../utils/env';

@Service()
export class UserService {
  constructor(@InjectConnection() private con: Connection) {}
  async create(options: CreateUserInput): Promise<UserQueryResponse> {
    await UserEntity.filterCreate(options);
    const create = new UserEntity();
    create.username = options.username;
    create.email = options.email;
    create.password = options.password;
    create.accounts = await create.insertAccounts();
    await this.con.manager.save(create);
    return {
      status: 'Ok',
      statusCode: 201,
      message: 'Accounts has been created',
    };
  }
  async all(): Promise<UserQueryResponse> {
    return {
      status: 'Ok',
      statusCode: 200,
      results: await this.con.createQueryBuilder(UserEntity, 'user').getMany(),
    };
  }
  async detail(args: string): Promise<UserQueryResponse> {
    const check = await this.con
      .createQueryBuilder(UserEntity, 'user')
      .where('user.id=:id', { id: args })
      .getOne();
    if (!check) {
      throw new Error('Accounts not found');
    }
    return {
      status: 'Ok',
      statusCode: 200,
      user: check,
    };
  }

  async update(
    options: UpdateAccountsInput,
    args: string
  ): Promise<UserQueryResponse> {
    const update = await this.con
      .createQueryBuilder(UserEntity, 'user')
      .leftJoinAndSelect('user.accounts', 'accounts')
      .where('user.username=:username', { username: args })
      .getOne();
    if (!update) {
      throw new Error('Accounts not found');
    }
    update.accounts.first_name = options.first_name;
    update.accounts.last_name = options.last_name;
    await this.con.manager.update(
      AccountsEntity,
      update.accounts.id,
      update.accounts
    );
    return {
      status: 'Ok',
      statusCode: 200,
      message: 'Accounts has been updated',
    };
  }

  async updateAvatar(file: Upload, args: string): Promise<UserQueryResponse> {
    const check = await this.con
      .createQueryBuilder(UserEntity, 'user')
      .leftJoinAndSelect('user.accounts', 'accounts')
      .where('user.username=:username', { username: args })
      .getOne();
    if (!check) {
      throw new Error('Accounts not found');
    }
    const filename = `${file.filename.replace('.', '')}${Math.random()
      .toString(36)
      .substring(8)}.${file.mimetype.split('/')[1]}`;
    const direction = `../assets/media/${filename}`;
    file
      .createReadStream()
      .pipe(fs.createWriteStream(path.join(__dirname, direction)))
      .on('finish', async () => {
        if (!__test__) {
          console.log('Image has been save');
        }
      })
      .on('error', (err) => console.log('Image cannot be save ' + err));
    check.accounts.avatar = `/static/${filename}`;
    await this.con.manager.update(
      AccountsEntity,
      check.accounts.id,
      check.accounts
    );
    return {
      status: 'Ok',
      statusCode: 200,
      message: 'Profile has been updated',
    };
  }
}
