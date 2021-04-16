import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { text_, timestamps } from '../../utils/env';

@ObjectType()
@Entity('country')
export class CountryEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true, length: 225 })
  country: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true, length: 225 })
  province: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true, length: 225 })
  city: string;

  @Field(() => String, { nullable: true })
  @Column({ type: text_, nullable: true })
  address: string;

  @Field(() => Date, { nullable: true })
  @Column(timestamps, { nullable: false })
  updateAt: Date;

  @BeforeInsert()
  async insertCreateAt() {
    this.updateAt = new Date();
  }
}
