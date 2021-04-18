import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateCategoryInput } from '../../schema/input/categoryInput';
import { timestamps } from '../../utils/env';
import { ProductEntity } from './ProductEntity';
import { UserEntity } from './UserEntity';

@ObjectType()
@Entity('category')
export class CategoryEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true, length: 225, unique: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column('varchar', { nullable: true })
  icon: string;

  @Field(() => Date, { nullable: true })
  @Column(timestamps, { nullable: false })
  createAt: Date;

  @Field(() => Date, { nullable: true })
  @Column(timestamps, { nullable: false, onUpdate: 'CURRENT_TIMESTAMP' })
  updateAt: Date;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.category)
  author: UserEntity;

  @Field(() => [ProductEntity], { nullable: true })
  @OneToMany(
    (productentity) => ProductEntity,
    (productentity) => productentity.category,
    {
      onDelete: 'CASCADE',
    }
  )
  @JoinColumn({
    name: 'product',
  })
  product: ProductEntity[];

  @BeforeInsert()
  async insertCreateAt() {
    this.createAt = new Date();
  }

  @BeforeInsert()
  async insertUpdateAt() {
    this.updateAt = new Date();
  }

  static filterName(options: CreateCategoryInput) {
    return this.findOne({
      where: {
        name: options.name,
      },
    });
  }
}
