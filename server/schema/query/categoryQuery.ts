import { Field, Int, ObjectType } from 'type-graphql';
import { CategoryEntity } from '../../typeorm/entity/CategoryEntity';
import { Status } from './userQuery';

@ObjectType()
export class CategoryQueryResponse {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  status: Status;

  @Field(() => Int)
  statusCode: number;

  @Field(() => CategoryEntity, { nullable: true })
  category?: CategoryEntity;

  @Field(() => [CategoryEntity], { nullable: true })
  results?: CategoryEntity[];
}
