import { Service } from 'typedi';
import { Connection } from 'typeorm';
import { InjectConnection } from 'typeorm-typedi-extensions';
import { AccountsEntity } from '../../typeorm/entity/AccountsEntity';
import { UserEntity } from '../../typeorm/entity/UserEntity';
import { CreateUserInput, UpdateAccountsInput } from '../input/userInput';
import { UserQueryResponse } from '../query/userQuery';

@Service()
export class UserService {
  constructor(@InjectConnection() private con: Connection) {}
  async create(options: CreateUserInput): Promise<UserQueryResponse> {
    await UserEntity.filterCreate(options);
    const create = new UserEntity();
    create.username = options.username;
    create.email = options.email;
    create.password = options.password;
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
}
