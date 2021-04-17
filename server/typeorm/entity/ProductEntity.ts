import { Field, ObjectType, Int } from 'type-graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { text_, timestamps } from '../../utils/env';
import { CategoryEntity } from './CategoryEntity';
import { UserEntity } from './UserEntity';

@ObjectType()
@Entity('product')
export class ProductEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field(() => String, { nullable: false })
  @Column('varchar', { nullable: false, unique: true, length: 225 })
  name: string;

  @Field(() => String, { nullable: false })
  @Column('varchar', { nullable: false, length: 225 })
  photo: string;

  @Field(() => String, { nullable: false })
  @Column('decimal', { precision: 12, scale: 2, default: '0' })
  sell: string;

  @Field(() => String, { nullable: false })
  @Column('decimal', { precision: 12, scale: 2, default: '0' })
  promo: string;

  @Field(() => String, { nullable: false })
  @Column('decimal', { precision: 12, scale: 2, default: '0' })
  agent: string;

  @Field(() => String, { nullable: false })
  @Column({ type: text_, nullable: false })
  description: string;

  @Field(() => Int, { nullable: true })
  @Column('tinyint', { default: 1 })
  status: number;

  @Field(() => CategoryEntity, { nullable: false })
  @ManyToOne(() => CategoryEntity, (category) => category.product)
  @JoinColumn({
    name: 'category',
    referencedColumnName: 'id',
  })
  category: CategoryEntity;

  @Field(() => UserEntity, { nullable: false })
  @ManyToOne(() => UserEntity, (user) => user.product)
  author: UserEntity;

  @Field(() => Date, { nullable: true })
  @Column(timestamps, { nullable: false })
  createAt: Date;

  @Field(() => Date, { nullable: true })
  @Column(timestamps, { nullable: false, onUpdate: 'CURRENT_TIMESTAMP' })
  updateAt: Date;

  @BeforeInsert()
  async insertCreateAt() {
    this.createAt = new Date();
  }

  @BeforeInsert()
  async insertUpdateAt() {
    this.updateAt = new Date();
  }

  @BeforeUpdate()
  async updateTimeAt() {
    this.updateAt = new Date();
  }
}
