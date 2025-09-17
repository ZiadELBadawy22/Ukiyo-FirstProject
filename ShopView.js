import React, { useState } from 'react';
import ProductList from './ProductList';

const ShopView = ({ allProducts, searchQuery, onProductClick }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('default');

    const newArrivals = allProducts.filter(p => p.isNew);
    const onSaleItems = allProducts.filter(p => p.salePrice && p.salePrice < p.price);
    const categories = ['All', ...new Set(allProducts.map(p => p.category).filter(Boolean))];

    const filteredAndSortedProducts = allProducts
        .filter(p => {
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            const priceA = a.salePrice || a.price;
            const priceB = b.salePrice || b.price;
            if (sortBy === 'price-asc') return priceA - priceB;
            if (sortBy === 'price-desc') return priceB - priceA;
            if (sortBy === 'rating-desc') return (b.averageRating || 0) - (a.averageRating || 0);
            return 0; // default sort
        });

    const isSearching = searchQuery.trim().length > 0;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {!isSearching && (
                <>
                    <section className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <a href="https://www.instagram.com/ukiyo_homes?igsh=dHhkZzkxZGxrajNk" target="_blank" rel="noopener noreferrer" className="block w-full h-auto">
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/ukiyo-store.firebasestorage.app/o/C61D24E3-561D-46AE-A89F-468AF2603D60.png?alt=media&token=36880b35-a9ea-46a1-977c-304a5872a7d3"
                                alt="Ukiyo Store Banner"
                                className="w-full h-auto object-cover"
                            />
                        </a>
                    </section>

                    {newArrivals.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">New Arrivals</h2>
                            <ProductList products={newArrivals} onProductClick={onProductClick} />
                        </section>
                    )}

                    {onSaleItems.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">On Sale</h2>
                            <ProductList products={onSaleItems} onProductClick={onProductClick} />
                        </section>
                    )}
                </>
            )}

            <section>
                <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
                    {isSearching ? 'Search Results' : 'All Products'}
                </h2>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {categories.map(category => (
                            <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-[#b08d57] text-white' : 'bg-white text-gray-700 hover:bg-[#b08d57]/20'}`}>
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy} className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#b08d57]">
                            <option value="default">Sort by</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating-desc">Highest Rating</option>
                        </select>
                    </div>
                </div>

                {filteredAndSortedProducts.length > 0 ? (
                    <ProductList products={filteredAndSortedProducts} onProductClick={onProductClick} />
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-600">No products match your search or filter.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ShopView;