'use client';

import React from 'react';
import { hasPermission } from '@/lib/permission';
import { PermissionElementProps } from '@/types/permission';

function EditButtonModal({ resource, action, icon: Icon, id, className }: Readonly<PermissionElementProps>) {
  const isAllowed = hasPermission(resource, action);

  if (!isAllowed) {
    return null;
  }

  return (
    <button
      className={className}
      onClick={() => open(`${id}`)}>
      <Icon size={18} />
      Edit
    </button>
  )
}

export default EditButtonModal;
