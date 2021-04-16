import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { timestamps } from '../../utils/env';
import bcrypt from 'bcrypt';
import { CreateUserInput, LoginInput } from '../../schema/input/userInput';
import jwt from 'jsonwebtoken';
import { secretsToken } from '../../utils/secrets';

@ObjectType()
@Entity('user')
export class UserEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: false, length: 225, unique: true })
  username: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: false, unique: true, length: 225 })
  email: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: false })
  password: string;

  @Field(() => Date, { nullable: true })
  @Column(timestamps, { nullable: false })
  createAt: Date;

  @BeforeInsert()
  async insertCreateAt() {
    this.createAt = new Date();
  }
  @BeforeInsert()
  async insertPassword() {
    this.password = await bcrypt.hash(
      this.password,
      Math.floor((Math.random() + 3) * Math.random())
    );
  }
  static async filterCreate(options: CreateUserInput) {
    const check = await this.findOne({
      where: [{ username: options.username }, { email: options.email }],
    });
    if (check) {
      throw new Error('Username or email already exists, please check again');
    }
    return check;
  }
  static async login(options: LoginInput) {
    const check = await this.findOne({
      where: [
        {
          username: options.token,
        },
        {
          email: options.token,
        },
      ],
    });
    if (!check) {
      throw new Error('Accounts not found');
    }
    const verify = await bcrypt.compare(options.password, check.password);
    if (!verify) {
      throw new Error('Incorrect username or password, please check again');
    }
    return jwt.sign({ user: check }, secretsToken, { algorithm: 'RS256' });
  }

  static Me(options: any) {
    return this.createQueryBuilder()
      .where('username=:username', { username: options })
      .getOne();
  }
}
