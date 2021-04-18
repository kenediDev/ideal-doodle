import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { UserDecode } from '../../config/sconfig';
import { ApolloContext } from '../../utils/apolloContext';
import { CreateProductInput } from '../input/productInput';
import { ProductQueryResponse } from '../query/productQuery';
import { ProductService } from '../service/productService';

@Service()
@Resolver()
export class ProductResolvers {
  constructor(private service: ProductService) {}

  @Query(() => ProductQueryResponse)
  async allProduct(): Promise<ProductQueryResponse> {
    return this.service.all();
  }

  @Authorized()
  @Mutation(() => ProductQueryResponse)
  async createProduct(
    @Arg('options') options: CreateProductInput,
    @Ctx() context: ApolloContext<UserDecode>
  ): Promise<ProductQueryResponse> {
    return this.service.create(options, context.user.user.username);
  }

  @Authorized()
  @Mutation(() => ProductQueryResponse)
  async destroyProduct(
    @Arg('options') options: string,
    @Ctx() context: ApolloContext<UserDecode>
  ): Promise<ProductQueryResponse> {
    return this.service.destroy(options, context.user.user.username);
  }

  @Mutation(() => ProductQueryResponse)
  async detailProduct(
    @Arg('options') options: string
  ): Promise<ProductQueryResponse> {
    return this.service.detail(options);
  }
}
