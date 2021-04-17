import { AuthChecker, buildSchema } from 'type-graphql';
import Container from 'typedi';
import { CategoryResolvers } from '../schema/resolvers/categoryResolvers';
import { ProductResolvers } from '../schema/resolvers/productResolvers';
import { UserResolvers } from '../schema/resolvers/userResolvers';

export interface UserDecode {
  user: {
    username: string;
    email: string;
    password: string;
    createAt: Date;
  };
  iat: string;
}

const AuthCheckers: AuthChecker<UserDecode> = ({ context }) => {
  const check = (context.user as any).user.username;
  if (!check) {
    return false;
  }
  return true;
};

export const schema = buildSchema({
  resolvers: [UserResolvers, CategoryResolvers, ProductResolvers],
  validate: false,
  authMode: 'null',
  authChecker: AuthCheckers,
  container: Container,
});
