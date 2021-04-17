import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { timestamps } from '../../utils/env';
import { CountryEntity } from './CountryEntity';

@ObjectType()
@Entity('accounts')
export class AccountsEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true, length: 225 })
  avatar: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true, length: 225 })
  first_name: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true, length: 225 })
  last_name: string;

  @Field(() => Date, { nullable: false })
  @Column(timestamps, { nullable: false })
  updateAt: Date;

  @Field(() => CountryEntity, { nullable: true })
  @OneToOne(() => CountryEntity)
  @JoinColumn({
    name: 'country',
    referencedColumnName: 'id',
  })
  location: CountryEntity;

  @BeforeInsert()
  async insertUpdateAt() {
    this.updateAt = new Date();
  }

  @BeforeUpdate()
  async updateTimeAt() {
    this.updateAt = new Date();
  }
}
