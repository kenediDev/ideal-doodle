import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Stream } from 'stream';
import { string } from 'joiful';

@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: false })
  @MinLength(6)
  username: string;
  @Field(() => String, { nullable: false })
  @IsEmail()
  email: string;
  @Field(() => String, { nullable: false })
  password: string;
  @Field(() => String, { nullable: false })
  confirm_password: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: false })
  @MinLength(6)
  username: string;

  @Field(() => String, { nullable: false })
  password: string;
}

@InputType()
export class LoginInput {
  @Field(() => String, { nullable: false })
  token: string;
  @Field(() => String, { nullable: false })
  password: string;
}

@InputType()
export class ResetInput {
  @Field(() => String, { nullable: false })
  token: string;
}

@InputType()
export class UpdateAccountsInput {
  @Field(() => String, { nullable: false })
  first_name: string;
  @Field(() => String, { nullable: true })
  last_name: string;
  @Field(() => String, { nullable: false })
  country: string;
  @Field(() => String, { nullable: false })
  province: string;
  @Field(() => String, { nullable: false })
  city: string;
  @Field(() => String, { nullable: false })
  address: string;
}

export interface Upload {
  filename: string;
  encoding: string;
  mimetype: string;
  createReadStream: () => Stream;
}

@InputType()
export class passwordInput {
  @Field(() => String, { nullable: true })
  old_password: string;

  @Field(() => String, { nullable: true })
  new_password: string;

  @Field(() => String, { nullable: true })
  confirm_password: string;
}
