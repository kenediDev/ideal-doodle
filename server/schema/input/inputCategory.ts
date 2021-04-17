import { GraphQLUpload } from 'graphql-upload';
import { Field, InputType } from 'type-graphql';
import { Upload } from './userInput';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => GraphQLUpload, { nullable: false })
  file: Upload;
}

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  name: string;
}
