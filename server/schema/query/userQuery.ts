import { Field, Int, ObjectType } from 'type-graphql';
import { UserEntity } from '../../typeorm/entity/UserEntity';

export type Status = 'Ok' | 'Failed';

@ObjectType()
export class UserQueryResponse {
  @Field(() => String, { nullable: true })
  token?: string;
  
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: false })
  status: Status;

  @Field(() => Int, { nullable: false })
  statusCode: number;

  @Field(() => UserEntity, { nullable: true })
  user?: UserEntity;

  @Field(() => [UserEntity], { nullable: true })
  results?: UserEntity[];
}
