import { Service } from 'typedi';
import { Connection } from 'typeorm';
import { InjectConnection } from 'typeorm-typedi-extensions';
import { CategoryEntity } from '../../typeorm/entity/CategoryEntity';
import { ProductEntity } from '../../typeorm/entity/ProductEntity';
import { UserEntity } from '../../typeorm/entity/UserEntity';
import { Saveimage } from '../../utils/imageSave';
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
        .getMany(),
    };
  }
}