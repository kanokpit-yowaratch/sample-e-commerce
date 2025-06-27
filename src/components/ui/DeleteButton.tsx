'use client';

import React from 'react';
import { hasPermission } from '@/lib/permission';
import { useDeleteItem } from '@/hooks/useQueryDashboard';
import { PermissionElementProps } from '@/types/permission';

function DeleteButton({ resource, action, icon: Icon, module, id, className }: Readonly<PermissionElementProps>) {
  const { mutate: mutateDelete } = useDeleteItem<number>(module ?? '');
  const isAllowed = hasPermission(resource, action);

  if (!isAllowed) {
    return null;
  }

  const handleDelete = (id: number) => {
    const confirmDelete = confirm('Are you sure you want to delete this information?');
    if (confirmDelete) {
      mutateDelete(id);
    }
  };

  return (
    <button
      className={className}
      onClick={() => handleDelete(id)}
    >
      <Icon size={18} />
      Delete
    </button>
  )
}

export default DeleteButton;
