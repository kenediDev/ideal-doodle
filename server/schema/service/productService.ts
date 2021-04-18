import { Service } from 'typedi';
import { Connection } from 'typeorm';
import { InjectConnection } from 'typeorm-typedi-extensions';
import { CategoryEntity } from '../../typeorm/entity/CategoryEntity';
import { ProductEntity } from '../../typeorm/entity/ProductEntity';
import { UserEntity } from '../../typeorm/entity/UserEntity';
import { __test__ } from '../../utils/env';
import { removeImage, Saveimage } from '../../utils/imageSave';
import { CreateProductInput } from '../input/productInput';
import { ProductQueryResponse } from '../query/productQuery';

@Service()
export class ProductService {
  constructor(@InjectConnection() private con: Connection) {}

  async create(
    options: CreateProductInput,
    args: string
  ): Promise<ProductQueryResponse> {
    const check = await this.con
      .createQueryBuilder(UserEntity, 'user')
      .leftJoinAndSelect('user.accounts', 'accounts')
      .leftJoinAndSelect('accounts.location', 'country')
      .where('user.username=:username', { username: args })
      .getOne();
    if (!check) {
      throw new Error('Accounts not found');
    }
    const file = await options.photo;
    const filename = `${file.filename.replace('.', '')}${Math.random()
      .toString(36)
      .substring(6)}.${file.mimetype.split('/')[1]}`;
    Saveimage(filename, 'product', file);

    const category = await this.con
      .getRepository(CategoryEntity)
      .findOne({ where: { id: options.category } });

    const create = new ProductEntity();
    create.name = options.name;
    create.photo = `/static/${filename}`;
    create.sell = options.sell;
    create.agent = options.agent;
    create.promo = options.promo;
    create.description = options.description;
    create.category = category;
    create.author = check;
    await this.con.manager.save(create);

    return {
      status: 'Ok',
      statusCode: 201,
      message: 'Product has been created',
    };
  }

  async all(): Promise<ProductQueryResponse> {
    return {
      status: 'Ok',
      statusCode: 200,
      results: await this.con
        .createQueryBuilder(ProductEntity, 'product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.author', 'user')
        .leftJoinAndSelect('user.accounts', 'accounts')
        .leftJoinAndSelect('accounts.location', 'country')
        .getMany(),
    };
  }

  async detail(args: string): Promise<ProductQueryResponse> {
    const check = await this.con
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.author', 'user')
      .leftJoinAndSelect('user.accounts', 'accounts')
      .leftJoinAndSelect('accounts.location', 'country')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.id=:id', { id: args })
      .getOne();
    if (!check) {
      throw new Error('Product not found');
    }
    return {
      status: 'Ok',
      statusCode: 200,
      product: check,
    };
  }

  async destroy(options: string, args: string): Promise<ProductQueryResponse> {
    const check = await this.con
      .createQueryBuilder(ProductEntity, 'product')
      .leftJoinAndSelect('product.author', 'user')
      .where('product.id=:id', { id: options });
    let count = await check.getCount();
    let data = await check.getOne();
    if (!check) {
      throw new Error('Product not found');
    }
    if (data.author.username !== args) {
      throw new Error("You don't have this access!");
    }
    if (!__test__) {
      removeImage(data.photo.replace('/static/', ''), 'product');
      await this.con.manager.remove(data);
    } else {
      if (count > 5) {
        removeImage(data.photo.replace('/static/', ''), 'product');
        await this.con.manager.remove(data);
      }
    }
    return {
      status: 'Ok',
      statusCode: 200,
      message: 'Product has been deleted',
    };
  }
}
