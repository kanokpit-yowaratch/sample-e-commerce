'use client';

import React from 'react';
import { hasPermission } from '@/lib/permission';
import { PermissionElementProps } from '@/types/permission';
import Link from 'next/link';

function EditLink({ resource, action, icon: Icon, module, id, className }: Readonly<PermissionElementProps>) {
  const isAllowed = hasPermission(resource, action);

  if (!isAllowed) {
    return null;
  }

  return (
    <Link
      href={`/dashboard/${module}/${id}`}
      className={className}
    >
      <Icon size={18} />
      Edit
    </Link>
  )
}

export default EditLink;
