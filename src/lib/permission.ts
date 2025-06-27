import { Permission } from '@prisma/client';
import { roleIdMap, RoleIdMapType } from '@/types/permission';

export function getRoleId(role: keyof RoleIdMapType): number {
  return roleIdMap[role];
}

export function hasPermission(resource: string, action: string): boolean {
  try {
    const userPermissions = localStorage.getItem('user_permissions');
    if (userPermissions) {
      const permissions: Permission[] = JSON.parse(userPermissions);
      const permission = permissions.find((p) => p.resource === resource && p.action === action);
      return !!permission;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}
