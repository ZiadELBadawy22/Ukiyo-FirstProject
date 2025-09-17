import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductList from '../components/ProductList';
import FilterPanel from '../components/FilterPanel';
import FeaturedProductCarousel from '../components/FeaturedProductCarousel';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import HomepageCarousel from '../components/HomepageCarousel';

const ShopPage = ({ allProducts, searchQuery, wishlist, onToggleWishlist }) => {
    const navigate = useNavigate();
    
    // State to hold the banners fetched from Firestore
    const [banners, setBanners] = useState([]);
    
    // This calculates the highest price among all products to set the slider's max value
    const maxPrice = useMemo(() => {
        if (allProducts.length === 0) return 5000; // A default max price
        const prices = allProducts.map(p => p.salePrice || p.price);
        return Math.ceil(Math.max(...prices) / 50) * 50; // Round up to the nearest 50
    }, [allProducts]);
    
    // This is the set of filters that are currently active on the page
    const [activeFilters, setActiveFilters] = useState({
        selectedCategory: 'All',
        priceRange: maxPrice,
        stockStatus: 'all',
        onSaleOnly: false,
    });
    
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [sortBy, setSortBy] = useState('default');

    // When the component loads or the maxPrice changes, update the filter's range
    useEffect(() => {
        setActiveFilters(prev => ({...prev, priceRange: maxPrice}));
    }, [maxPrice]);

    // Fetch banners from Firestore when the component mounts
    useEffect(() => {
        const bannersRef = collection(db, "storeSettings", "banners", "slides");
        const q = query(bannersRef, orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);
    
    const isLoading = allProducts.length === 0;

    const categories = useMemo(() => ['All', ...new Set(allProducts.map(p => p.category).filter(Boolean))], [allProducts]);
    const newArrivals = useMemo(() => allProducts.filter(p => p.isNew), [allProducts]);

    const filteredAndSortedProducts = useMemo(() => {
        return allProducts
            .filter(p => {
                const effectivePrice = p.salePrice || p.price;
                const matchesCategory = activeFilters.selectedCategory === 'All' || p.category === activeFilters.selectedCategory;
                const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesPrice = effectivePrice <= activeFilters.priceRange;
                const matchesStock = activeFilters.stockStatus === 'all' || (activeFilters.stockStatus === 'inStock' && p.quantity > 0) || (activeFilters.stockStatus === 'outOfStock' && p.quantity === 0);
                const matchesSale = !activeFilters.onSaleOnly || (p.salePrice && p.salePrice < p.price);
                return matchesCategory && matchesSearch && matchesPrice && matchesStock && matchesSale;
            })
            .sort((a, b) => {
                const priceA = a.salePrice || a.price;
                const priceB = b.salePrice || b.price;
                if (sortBy === 'price-asc') return priceA - priceB;
                if (sortBy === 'price-desc') return priceB - priceA;
                if (sortBy === 'rating-desc') return (b.averageRating || 0) - (a.averageRating || 0);
                return 0;
            });
    }, [allProducts, activeFilters, searchQuery, sortBy]);

    const isSearching = searchQuery.trim().length > 0;

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    const handleApplyFilters = (newFilters) => {
        setActiveFilters(newFilters);
    };

    const handleClearFilters = () => {
        setActiveFilters({
            selectedCategory: 'All',
            priceRange: maxPrice,
            stockStatus: 'all',
            onSaleOnly: false,
        });
    };

    return (
        <motion.div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                {!isSearching && !isLoading && (
                    <>
                        <HomepageCarousel banners={banners} />

                        {newArrivals.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">New Arrivals</h2>
                                <FeaturedProductCarousel 
                                    products={newArrivals} 
                                    onProductClick={handleProductClick}
                                    wishlist={wishlist}
                                    onToggleWishlist={onToggleWishlist}
                                />
                            </section>
                        )}
                    </>
                )}

                <section>
                    <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
                        {isSearching ? 'Search Results' : 'All Products'}
                    </h2>

                    <div className="flex justify-between items-center gap-4 mb-8">
                        <button 
                            onClick={() => setIsFilterPanelOpen(true)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L12 14.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 016 17V6H4a1 1 0 01-1-1V4z"></path></svg>
                            Filters
                        </button>
                        <div className="relative">
                            <select onChange={(e) => setSortBy(e.target.value)} value={sortBy} className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#b08d57]">
                                <option value="default">Sort by</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="rating-desc">Highest Rating</option>
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
                            {[...Array(6)].map((_, index) => <ProductCardSkeleton key={index} />)}
                        </div>
                    ) : filteredAndSortedProducts.length > 0 ? (
                        <ProductList
                            products={filteredAndSortedProducts}
                            onProductClick={handleProductClick}
                            wishlist={wishlist}
                            onToggleWishlist={onToggleWishlist}
                        />
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-600">No products match your filters.</p>
                        </div>
                    )}
                </section>
            </div>
            
            <FilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                activeFilters={activeFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                categories={categories}
                maxPrice={maxPrice}
            />
        </motion.div>
    );
};

export default ShopPage;

