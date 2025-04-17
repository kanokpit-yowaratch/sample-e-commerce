import React from 'react';

const categories = [
	{ id: 1, name: 'Electronics', image: '/images/photo-mask.jpg' },
	{ id: 2, name: 'Fashion', image: '/images/photo-mask.jpg' },
	{ id: 3, name: 'Home & Kitchen', image: '/images/photo-mask.jpg' },
	{ id: 4, name: 'Beauty & Personal Care', image: '/images/photo-mask.jpg' },
];

function CategoryGrid() {
	const commonStyles =
		'relative flex items-center justify-center text-white text-2xl font-semibold h-full z-10 transition-all duration-300';
	const hoverStyles = 'hover:scale-105 hover:[text-shadow:var(--glow-color)]';
	const bgGradient = 'bg-gradient-to-tr from-black via-[90%] to-transparent';

	return (
		<section className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h2 className="text-2xl font-bold mb-8">Category</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{categories.map((category) => (
					<div
						key={category.id}
						className="bg-stone-100 h-42 relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow">
						<div className="absolute inset-0 z-0 bg-[url('/images/category-bg.jpg')] bg-cover bg-center"></div>
						<div className={`${commonStyles} ${bgGradient} ${hoverStyles}`}>{category.name}</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default CategoryGrid;
