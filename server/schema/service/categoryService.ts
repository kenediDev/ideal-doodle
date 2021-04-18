import { Service } from 'typedi';
import { Connection } from 'typeorm';
import { InjectConnection } from 'typeorm-typedi-extensions';
import { CategoryEntity } from '../../typeorm/entity/CategoryEntity';
import { UserEntity } from '../../typeorm/entity/UserEntity';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  UpdateIconCategoryInput,
} from '../input/categoryInput';
import { CategoryQueryResponse } from '../query/categoryQuery';
import fs from 'fs';
import path from 'path';
import { __test__ } from '../../utils/env';
import { Saveimage } from '../../utils/imageSave';

@Service()
export class CategoryService {
  constructor(@InjectConnection() private con: Connection) {}

  async all(): Promise<CategoryQueryResponse> {
    return {
      status: 'Ok',
      statusCode: 200,
      results: await this.con
        .createQueryBuilder(CategoryEntity, 'category')
        .leftJoinAndSelect('category.author', 'user')
        .leftJoinAndSelect('user.accounts', 'accounts')
        .leftJoinAndSelect('accounts.location', 'country')
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
    const file = await options.file;
    const filename = `${file.filename.replace('.', '')}${Math.random()
      .toString(36)
      .substring(8)}.${file.mimetype.split('/')[1]}`;
    Saveimage(filename, 'category', file);

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
      .leftJoinAndSelect('category.author', 'user')
      .leftJoinAndSelect('user.accounts', 'accounts')
      .leftJoinAndSelect('accounts.location', 'country')
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

  async update(options: UpdateCategoryInput): Promise<CategoryQueryResponse> {
    const check = await this.con
      .createQueryBuilder(CategoryEntity, 'category')
      .where('category.id=:id', { id: options.id })
      .getOne();
    if (!check) {
      throw new Error('Category not found');
    }
    check.name = options.name;
    await this.con.manager.update(CategoryEntity, check.id, check);
    return {
      status: 'Ok',
      statusCode: 200,
      message: 'Category has been updated',
    };
  }

  async updateIcon(
    options: UpdateIconCategoryInput
  ): Promise<CategoryQueryResponse> {
    const check = await this.con
      .getRepository(CategoryEntity)
      .findOne({ where: { id: options.id } });
    if (!check) {
      throw new Error('Category not found');
    }
    try {
      fs.unlinkSync(
        path.join(
          __dirname,
          `../assets/media/category/${check.icon.replace('/static/', '')}`
        )
      );
    } catch (err) {}
    const file = await options.file;
    const filename = `${
      __test__ ? 'Update-Icon' : file.filename.replace('.', '')
    }${Math.random().toString(36).substring(6)}.${file.mimetype.split('/')[1]}`;
    Saveimage(filename, 'category', file);
    check.icon = `/static/${filename}`;

    await this.con.manager.update(CategoryEntity, check.id, check);
    return {
      status: 'Ok',
      statusCode: 200,
      message: 'Icon has been updated',
    };
  }

  async destroy(options: string, args: string): Promise<CategoryQueryResponse> {
    const check = await this.con
      .createQueryBuilder(CategoryEntity, 'category')
      .leftJoinAndSelect('category.author', 'user')
      .where('category.id=:id', { id: options })
      .getOne();
    if (!check) {
      throw new Error('Category not found');
    }
    if (check.author.username !== args) {
      throw new Error('You not have this access!');
    }
    await this.con.manager.remove(check);
    return {
      status: 'Ok',
      statusCode: 200,
      message: 'Category has been deleted',
    };
  }
}
