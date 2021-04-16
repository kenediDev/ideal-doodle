import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

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
}
