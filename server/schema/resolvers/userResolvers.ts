import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { UserDecode } from '../../config/sconfig';
import { UserEntity } from '../../typeorm/entity/UserEntity';
import { ApolloContext } from '../../utils/apolloContext';
import {
  CreateUserInput,
  LoginInput,
  ResetInput,
  UpdateAccountsInput,
} from '../input/userInput';
import { UserQueryResponse } from '../query/userQuery';
import { UserService } from '../service/userService';

@Service()
@Resolver()
export class UserResolvers {
  constructor(private service: UserService) {}

  @Mutation(() => UserQueryResponse)
  async createUser(
    @Arg('options') options: CreateUserInput
  ): Promise<UserQueryResponse> {
    return this.service.create(options);
  }

  @Mutation(() => UserQueryResponse)
  async login(@Arg('options') options: LoginInput): Promise<UserQueryResponse> {
    return {
      status: 'Ok',
      statusCode: 200,
      token: await UserEntity.login(options),
    };
  }

  @Authorized()
  @Query(() => UserQueryResponse)
  async allUser(): Promise<UserQueryResponse> {
    return this.service.all();
  }

  @Authorized()
  @Query(() => UserQueryResponse)
  async detailUser(
    @Arg('options') options: string
  ): Promise<UserQueryResponse> {
    return this.service.detail(options);
  }

  @Authorized()
  @Query(() => UserQueryResponse)
  async me(
    @Ctx() context: ApolloContext<UserDecode>
  ): Promise<UserQueryResponse> {
    return {
      status: 'Ok',
      statusCode: 200,
      user: await UserEntity.Me(context.user.user.username),
    };
  }

  @Mutation(() => UserQueryResponse)
  async reset(@Arg('options') options: ResetInput): Promise<UserQueryResponse> {
    await UserEntity.reset(options);
    return {
      status: 'Ok',
      statusCode: 200,
      message: 'Accounts has been reset',
    };
  }

  @Mutation(() => UserQueryResponse)
  async updateAccounts(
    @Arg('options') options: UpdateAccountsInput,
    @Ctx() context: ApolloContext<UserDecode>
  ): Promise<UserQueryResponse> {
    return this.service.update(options, context.user.user.username);
  }
}
