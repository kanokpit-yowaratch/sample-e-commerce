import React from 'react';
// import NextImage from 'next/image';

const featuredProducts = [
  { id: 1, name: "Wireless Earbuds", price: "$129.99", image: "/images/photo-mask.jpg" },
  { id: 2, name: "Smart Watch", price: "$199.99", image: "/images/photo-mask.jpg" },
  { id: 3, name: "Premium Backpack", price: "$89.99", image: "/images/photo-mask.jpg" }
];

function FeaturedProducts() {
  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-amber-100 h-42 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-accent mt-2">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts