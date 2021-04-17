import { Field, Int, ObjectType } from 'type-graphql';
import { ProductEntity } from '../../typeorm/entity/ProductEntity';
import { Status } from './userQuery';

@ObjectType()
export class ProductQueryResponse {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: false })
  status: Status;

  @Field(() => Int, { nullable: false })
  statusCode: number;

  @Field(() => ProductEntity, { nullable: true })
  product?: ProductEntity;

  @Field(() => [ProductEntity], { nullable: true })
  results?: ProductEntity[];
}
