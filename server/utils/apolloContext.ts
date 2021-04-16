import { Request, Response } from 'express';

export interface ApolloContext<UserDecode> {
  req: Request;
  res: Response;
  user: UserDecode;
}
