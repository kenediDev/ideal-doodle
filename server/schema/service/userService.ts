import { Service } from 'typedi';
import { Connection } from 'typeorm';
import { InjectConnection } from 'typeorm-typedi-extensions';
import { AccountsEntity } from '../../typeorm/entity/AccountsEntity';
import { UserEntity } from '../../typeorm/entity/UserEntity';
import {
  CreateUserInput,
  passwordInput,
  UpdateAccountsInput,
  Upload,
} from '../input/userInput';
import { UserQueryResponse } from '../query/userQuery';
import fs from 'fs';
import path from 'path';
import { __test__ } from '../../utils/env';
import { CountryEntity } from '../../typeorm/entity/CountryEntity';
import { Saveimage } from '../../utils/imageSave';

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
      results: await this.con
        .createQueryBuilder(UserEntity, 'user')
        .leftJoinAndSelect('user.accounts', 'accounts')
        .leftJoinAndSelect('accounts.location', 'country')
        .getMany(),
    };
  }
  async detail(args: string): Promise<UserQueryResponse> {
    const check = await this.con
      .createQueryBuilder(UserEntity, 'user')
      .leftJoinAndSelect('user.accounts', 'accounts')
      .leftJoinAndSelect('accounts.location', 'country')
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
      .leftJoinAndSelect('accounts.location', 'country')
      .where('user.username=:username', { username: args })
      .getOne();
    if (!update) {
      throw new Error('Accounts not found');
    }
    update.accounts.first_name = options.first_name;
    update.accounts.last_name = options.last_name;
    update.accounts.location.country = options.country;
    update.accounts.location.province = options.province;
    update.accounts.location.city = options.city;
    update.accounts.location.address = options.address;
    await this.con.manager.update(
      AccountsEntity,
      update.accounts.id,
      update.accounts
    );

    await this.con.manager.update(
      CountryEntity,
      update.accounts.location.id,
      update.accounts.location
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
    Saveimage(filename, 'author', file);
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

  async updatePassword(
    options: passwordInput,
    args: string
  ): Promise<UserQueryResponse> {
    const check = await UserEntity.findOne({ where: { username: args } });
    if (options.new_password !== options.confirm_password) {
      throw new Error("Password don't match, please check again");
    }
    await UserEntity.verifyPassword(options, args);
    check.password = options.new_password;
    await this.con.manager.update(UserEntity, check.id, check);
    return {
      status: 'Ok',
      statusCode: 200,
      message: 'Password has been updated',
    };
  }
}
