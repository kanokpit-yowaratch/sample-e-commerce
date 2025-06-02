import { User } from '@prisma/client';
import { Pagination } from './common';

export type UserCreate = Pick<User, 'name' | 'email' | 'role'>;

export type UserResponse = User & {
  address: [];
};

export type UserPagination = Pagination & {
  data: UserResponse[];
};
