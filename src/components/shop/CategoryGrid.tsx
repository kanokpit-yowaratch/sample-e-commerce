import React from 'react';
// import NextImage from 'next/image';

const categories = [
	{ id: 1, name: 'Electronics', image: '/images/photo-mask.jpg' },
	{ id: 2, name: 'Fashion', image: '/images/photo-mask.jpg' },
	{ id: 3, name: 'Home & Kitchen', image: '/images/photo-mask.jpg' },
	{ id: 4, name: 'Beauty & Personal Care', image: '/images/photo-mask.jpg' },
];

function CategoryGrid() {
	return (
		<section className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{categories.map((category) => (
					<div
						key={category.id}
						className="bg-stone-100 h-42 relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow">
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
							<h3 className="text-white text-xl font-semibold">{category.name}</h3>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default CategoryGrid;
