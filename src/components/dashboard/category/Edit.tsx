'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { IdParams } from '@/types/common';
import { useForm } from "react-hook-form";
import { CategorySchema, categorySchema } from '@/lib/schemas/category-schema';
import { zodResolver } from "@hookform/resolvers/zod";
import { useItem, useUpdateItem } from '@/hooks/useQueryDashboard';
import { CategoryCreate } from '@/types/category';
import Link from 'next/link';

function CategoryEdit({ id }: Readonly<IdParams>) {
  const { data, isLoading, error } = useItem<CategoryCreate>('categories', id);
  const { mutate } = useUpdateItem('categories', id);
  const [category, setCategory] = useState<CategoryCreate>({ name: '' });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const onSubmit = () => {
    mutate(category);
  };

  useEffect(() => {
    if (data) {
      setValue('name', data.name);
    }
  }, [data, setValue]);

  return (
    <>
      <Link href={'/dashboard/categories'} className="p-2 bg-blue-600 text-white cursor-pointer rounded-md">Back</Link>
      <div className='mt-4 mb-2 text-xl font-bold'>
        Edit category ID: {id}
      </div>
      <div className="h-10">
        {isLoading && <span>Loading...</span>}
      </div>
      {error && <div>Error: {error.message}</div>}
      {!data && !isLoading && !error && <div>Category not found</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <input
          {...register("name")}
          className="border p-2 cursor-pointer rounded-md"
          placeholder="Category Name"
          onChange={handleChange}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-md">Update</button>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </form>
    </>
  )
}

export default CategoryEdit;
