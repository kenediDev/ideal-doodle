import { Service } from 'typedi';
import { Connection } from 'typeorm';
import { InjectConnection } from 'typeorm-typedi-extensions';
import { CategoryEntity } from '../../typeorm/entity/CategoryEntity';
import { UserEntity } from '../../typeorm/entity/UserEntity';
import { CreateCategoryInput } from '../input/inputCategory';
import { CategoryQueryResponse } from '../query/categoryQuery';

@Service()
export class CategoryService {
  constructor(@InjectConnection() private con: Connection) {}

  async all(): Promise<CategoryQueryResponse> {
    return {
      status: 'Ok',
      statusCode: 200,
      results: await this.con
        .createQueryBuilder(CategoryEntity, 'category')
        .getMany(),
    };
  }

  async create(
    options: CreateCategoryInput,
    args: string
  ): Promise<CategoryQueryResponse> {
    const check = await CategoryEntity.filterName(options);
    if (check) {
      throw new Error('Name category already exists, please check again');
    }

    const user = await this.con
      .createQueryBuilder(UserEntity, 'user')
      .leftJoinAndSelect('user.accounts', 'accounts')
      .leftJoinAndSelect('accounts.location', 'country')
      .where('user.username=:username', { username: args })
      .getOne();

    const create = new CategoryEntity();
    create.name = options.name;
    create.author = user;
    await this.con.manager.save(create);
    return {
      status: 'Ok',
      statusCode: 201,
      message: 'Category has been created',
    };
  }

  async detail(args: string): Promise<CategoryQueryResponse> {
    const check = await this.con
      .createQueryBuilder(CategoryEntity, 'category')
      .where('category.id=:id', { id: args })
      .getOne();
    if (!check) {
      throw new Error('Category not found');
    }
    return {
      status: 'Ok',
      statusCode: 200,
      category: check,
    };
  }
}
