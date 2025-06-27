'use client';

import React, { useState } from 'react';
import { Permission } from '@prisma/client';
import { useModal } from '@/stores/zustand/modalStore';
import { PermissionModal } from './PermissionModal';
import { useItemsWithPagination } from '@/hooks/useQueryProtected';
import { PaginationResponse } from '@/types/common';
import DeleteButton from '@/components/ui/DeleteButton';
import Pagination from '@/components/ui/Pagination';
import { Plus, Trash } from 'lucide-react';

const PermissionDataTable = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const {
    data: permissions,
    isLoading,
    error,
  } = useItemsWithPagination<Permission, PaginationResponse<Permission>>('permissions', {
    page,
    perPage,
  });
  const { open } = useModal();

  return (
    <div className="w-full p-4 rounded-lg shadow-sm">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="left-3">
          <h1>Permissions</h1>
        </div>
        <div className="right-3">
          <button
            onClick={() => open()}
            className="flex place-items-center gap-1 bg-green-700 text-white px-4 py-2 rounded-md btn-primary cursor-pointer hover:bg-green-800 transition-all">
            <Plus />
            Create
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary text-secondary-foreground">
              <th className="p-4">Role</th>
              <th className="p-4">Resource</th>
              <th className="p-4">Action</th>
              <th className="p-4">Created At</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="p4 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={6} className="p4 text-center">
                  {error.message}
                </td>
              </tr>
            )}
            {permissions?.data?.map((item, index) => (
              <tr
                key={`${item.roleId}-${item.resource}-${item.action}}`}
                className={`border-b border-border hover:bg-muted transition-colors ${index % 2 === 0 ? 'bg-card' : 'bg-secondary'}`}>
                <td className="p-4">{item.roleId}</td>
                <td className="p-4">{item.resource}</td>
                <td className="p-4">{item.action}</td>
                <td className="p-4">{item.createdAt?.toString().slice(0, 10) ?? ''}</td>
                <td className="p-4">
                  <div className="w-full flex items-center justify-center gap-2">
                    <DeleteButton
                      resource={'data'}
                      action={'delete'}
                      icon={Trash}
                      module="products"
                      id={item.id}
                      className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-md cursor-pointer hover:bg-red-700 transition-all"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        pageItems={permissions?.data.length ?? 0}
        totalItems={permissions?.pagination.total ?? 0}
        currentPage={page}
        setCurrentPage={setPage}
        rowsPerPage={perPage}
        setRowsPerPage={setPerPage}
      />
      <PermissionModal />
    </div>
  );
};

export default PermissionDataTable;
