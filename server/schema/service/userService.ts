import { Service } from 'typedi';
import { Connection } from 'typeorm';
import { InjectConnection } from 'typeorm-typedi-extensions';
import { UserEntity } from '../../typeorm/entity/UserEntity';
import { CreateUserInput } from '../input/userInput';
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
}
