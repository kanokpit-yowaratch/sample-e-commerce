import { Permission } from '@prisma/client';
import { LucideIcon } from 'lucide-react';

export type PermissionSet = Pick<Permission, 'roleId' | 'resource' | 'action'>;

export type RoleIdMapType = {
  admin: number;
  store: number;
  customer: number;
  guest: number;
}

export const roleIdMap: RoleIdMapType = {
  admin: 1,
  store: 2,
  customer: 3,
  guest: 4,
};

export type PermissionElementProps = {
  resource: string;
  action: string;
  icon: LucideIcon;
  module?: string;
  id: number;
  className: string;
}

export const initialPermission = { roleId: roleIdMap['guest'], resource: '', action: '' };
export const allowedMenus = ['dashboard', 'users', 'permissions', 'categories', 'products', 'orders', 'reports'];
