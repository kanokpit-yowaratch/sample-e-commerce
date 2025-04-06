import React from 'react';
import { IdParamProps } from '@/types/common';
import CategoryEdit from '@/components/dashboard/category/Edit';

const CategoryIdPage = async ({ params }: IdParamProps) => {
	const { id } = await params;

	return <CategoryEdit id={id} />;
};

export default CategoryIdPage;
