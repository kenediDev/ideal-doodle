import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { UserDecode } from '../../config/sconfig';
import { ApolloContext } from '../../utils/apolloContext';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  UpdateIconCategoryInput,
} from '../input/categoryInput';
import { CategoryQueryResponse } from '../query/categoryQuery';
import { CategoryService } from '../service/categoryService';

@Service()
@Resolver()
export class CategoryResolvers {
  constructor(private service: CategoryService) {}

  @Query(() => CategoryQueryResponse)
  async allCategory(): Promise<CategoryQueryResponse> {
    return this.service.all();
  }

  @Query(() => CategoryQueryResponse)
  async detailCategory(
    @Arg('options') options: string
  ): Promise<CategoryQueryResponse> {
    return this.service.detail(options);
  }

  @Authorized()
  @Mutation(() => CategoryQueryResponse)
  async createCategory(
    @Arg('options') options: CreateCategoryInput,
    @Ctx() context: ApolloContext<UserDecode>
  ): Promise<CategoryQueryResponse> {
    return this.service.create(options, context.user.user.username);
  }

  @Authorized()
  @Mutation(() => CategoryQueryResponse)
  async updateCategory(
    @Arg('options') options: UpdateCategoryInput,
    @Ctx() context: ApolloContext<UserDecode>
  ): Promise<CategoryQueryResponse> {
    return this.service.update(options, context.user.user.username);
  }

  @Authorized()
  @Mutation(() => CategoryQueryResponse)
  async updateIconCategory(
    @Arg('options') options: UpdateIconCategoryInput
  ): Promise<CategoryQueryResponse> {
    return this.service.updateIcon(options);
  }

  @Mutation(() => CategoryQueryResponse)
  async destroyCategory(
    @Arg('options') options: string,
    @Ctx() context: ApolloContext<UserDecode>
  ): Promise<CategoryQueryResponse> {
    return this.service.destroy(options, context.user.user.username);
  }
}
