'use client';

import React from 'react';
import { useDeleteItem, useItems } from '@/hooks/useQueryDashboard';
import { Category } from '@prisma/client';
import Link from 'next/link';
import { Edit, Trash } from 'lucide-react';

function CategoryList() {
  const { data: categories, isLoading } = useItems<Category[]>('categories');
  const { mutate: mutateDelete } = useDeleteItem('categories');

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('Are you sure you want to delete this category?');
    if (confirmDelete) {
      mutateDelete(id);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Category list</h2>
        <Link href={'/dashboard/categories/create'}>Create</Link>
      </div>
      <div className="h-12">
        {
          isLoading && <span>Loading...</span>
        }
      </div>
      <ul>
        {categories?.map((category) => (
          <li key={category.id} className="flex justify-between items-center gap-2">
            <div className="flex-1">{category.id}: {category.name}</div>
            <Link href={`/dashboard/categories/${category.id}`}>
              <Edit />
            </Link>
            <button
              className="p-2 bg-red-600 text-white cursor-pointer rounded-md"
              onClick={() => handleDelete(category.id)}
            >
              <Trash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoryList;