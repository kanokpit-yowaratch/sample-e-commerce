import { Role, User } from '@prisma/client';
import { Pagination } from './common';

export type UserCreate = Pick<User, 'name' | 'email' | 'role' | 'phone' | 'password'>;
export type UserUpdate = Pick<User, 'name' | 'role' | 'phone'>;

export type UserResponse = User & {
  address: [];
};

export type UserPagination = Pagination & {
  data: UserResponse[];
};

export const roles = Object.values(Role) as [string, ...string[]];
export const initialUser = { name: '', email: '', phone: '', password: '', role: Role.guest };
