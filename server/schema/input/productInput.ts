import { MinLength } from 'class-validator';
import { GraphQLUpload } from 'graphql-upload';
import { Field, InputType } from 'type-graphql';
import { Upload } from './userInput';

@InputType()
export class CreateProductInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: false })
  @MinLength(2, {
    message: 'Character names must be longer than 2 characters',
  })
  name: string;
  @Field(() => GraphQLUpload, { nullable: false })
  photo: Upload;
  @Field(() => String, { nullable: false })
  sell: string;
  @Field(() => String, { nullable: true })
  promo: string;
  @Field(() => String, { nullable: true })
  agent: string;
  @Field(() => String, { nullable: false })
  @MinLength(50, {
    message: 'Characters description must be longer than 50 characters',
  })
  description: string;
  @Field(() => String, { nullable: true })
  category?: string;
}
