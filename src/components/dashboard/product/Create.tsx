'use client';

import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ProductSchema, productSchema } from '@/lib/schemas/product-schema';
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductCreate } from '@/types/product';
import { Category, Product } from "@prisma/client";
import { useCreateItem, useItems, useUploadCover } from "@/hooks/useQueryDashboard";
import Link from 'next/link';
import NextImage from 'next/image';

function Create() {
  const { mutate: mutateCreate } = useCreateItem<ProductCreate, Product>('products');
  const { mutate: mutateUpload } = useUploadCover('upload');
  const { data: categories } = useItems<Category[]>('categories');
  const [product, setProduct] = useState<ProductCreate>(
    { name: '', description: '', price: 0, categoryId: 0 }
  );
  const [imageFile, setImageFile] = useState<File>();
  const [successCreate, setSuccessCreate] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('/images/photo-mask.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    reValidateMode: 'onChange',
    defaultValues: { name: '', description: '', price: 0, categoryId: 0 }
  });

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: parseInt(value, 10) });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmitCreate = () => {
    mutateCreate(product, {
      onSuccess: (response) => {
        if (imageFile && response?.id) {
          const formData = new FormData();
          formData.append('productId', response.id.toString());
          formData.append('file', imageFile);
          formData.append('imageType', 'cover');
          mutateUpload(formData, {
            onSuccess: () => {
              setImageFile(undefined);
              setSelectedImage('/images/photo-mask.jpg');
            },
          });
        }
        reset();
        setSuccessCreate('Product created successfully');
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  return (
    <>
      <Link href={'/dashboard/products'} className="p-2 bg-blue-600 text-white cursor-pointer rounded-md">Back</Link>
      <div className='mt-4 mb-2 text-xl font-bold'>
        Create new product
      </div>
      <form onSubmit={handleSubmit(onSubmitCreate)} className="flex flex-col gap-2 min-w-md max-w-lg">
        <div className="flex flex-col gap-1">
          <span>Category</span>
          <select
            {...register("categoryId", { valueAsNumber: true })}
            className="border rounded-md p-2"
            onChange={handleCategoryChange}
          >
            <option value="0">Select a category</option>
            {
              categories?.map((category) => (
                <option key={category.name} value={category.id}>{category.name}</option>
              ))
            }
          </select>
          {errors.categoryId && <p className="text-red-500">{errors.categoryId.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <span>Name</span>
          <input
            {...register("name")}
            className="border rounded-md p-2"
            placeholder="Name"
            onChange={handleChange}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <span>Description</span>
          <input
            {...register("description")}
            className="border rounded-md p-2"
            placeholder="Description"
            onChange={handleChange}
          />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <span>Price</span>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="border rounded-md p-2"
            placeholder="Price"
            onChange={handleChange}
          />
          {errors.price && <p className="text-red-500">{errors.price.message}</p>}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
          <div className="relative my-2 w-50 h-40 rounded-lg overflow-hidden shadow-lg">
            {selectedImage && (
              <NextImage
                src={selectedImage}
                fill={true}
                objectFit="cover"
                priority={true}
                alt="Product cover"
                className="w-full h-auto"
              />
            )}
          </div>
          <button
            type="button"
            onClick={handleButtonClick}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Select Image
          </button>
        </div>
        <div className="h-5 mb-2 text-center">
          {successCreate && <span className="text-green-500 text-lg">{successCreate}</span>}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-md">Create</button>
      </form>
    </>
  )
}

export default Create