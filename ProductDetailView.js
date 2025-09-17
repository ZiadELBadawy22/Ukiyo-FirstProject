import React, { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import ProductList from './ProductList';
import ReviewsSection from './ReviewsSection';
import StarRating from './StarRating';
import FeaturedProductCarousel from './FeaturedProductCarousel';

const ProductDetailView = ({ product, onProductClick, onAddToCart, onImageClick, wishlist, onToggleWishlist, ...reviewProps }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const TAP_THRESHOLD = 10; // How far a finger can move and still be considered a "tap"

    // This effect fetches a small, random set of products for the "More Products" section.
    // It runs independently, making the page load much faster.
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            const productsRef = collection(db, 'products');
            const q = query(productsRef, limit(10));
            const snapshot = await getDocs(q);
            const allFetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            const shuffled = allFetchedProducts
                .filter(p => p.id !== product.id) // Exclude the current product
                .sort(() => 0.5 - Math.random()) // Shuffle the results
                .slice(0, 6); // Take the first 6
            setRelatedProducts(shuffled);
        };

        if (product) {
            fetchRelatedProducts();
        }
    }, [product]);

    const getImages = useCallback(() => {
        if (product?.imageUrls?.length > 0) {
            return product.imageUrls;
        }
        return ['https://placehold.co/600x600/cccccc/ffffff?text=No+Image'];
    }, [product]);

    const images = getImages();
    const onSale = product.salePrice && product.salePrice < product.price;

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchEndX.current = e.touches[0].clientX; // Reset end position on new touch
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeDistance = Math.abs(touchStartX.current - touchEndX.current);

        if (swipeDistance < TAP_THRESHOLD) {
            // If the finger moved less than the threshold, it's a tap
            onImageClick(images, currentIndex);
        } else {
            // Otherwise, it's a swipe
            if (touchStartX.current - touchEndX.current > 75) { // Swiped left
                setCurrentIndex(prev => (prev + 1) % images.length);
            } else if (touchEndX.current - touchStartX.current > 75) { // Swiped right
                setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Gallery */}
                <div className="flex flex-col gap-4">
                    <div
                        className="relative h-96 md:h-[550px] w-full cursor-pointer overflow-hidden rounded-lg shadow-lg"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                         <div className="flex h-full transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)`}}>
                            {images.map((url, index) => (
                                <img key={index} src={url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover flex-shrink-0" />
                            ))}
                        </div>
                    </div>
                    {images.length > 1 && (
                        <div className="flex justify-center gap-2">
                            {images.map((url, index) => (
                                <button key={index} onClick={() => setCurrentIndex(index)} className={`w-20 h-20 rounded-md overflow-hidden border-2 ${currentIndex === index ? 'border-[#b08d57]' : 'border-transparent'}`}>
                                    <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-center">
                    <span className="text-sm font-medium text-[#b08d57]">{product.category}</span>
                    <h1 className="text-4xl font-serif font-bold text-gray-800 mt-2">{product.name}</h1>
                    {product.reviewCount > 0 && (
                        <div className="flex items-center gap-2 mt-4">
                            <StarRating rating={product.averageRating} />
                            <a href="#reviews" className="text-sm text-gray-600 hover:underline">({product.reviewCount} reviews)</a>
                        </div>
                    )}
                    <p className="text-gray-600 mt-4 text-lg leading-relaxed">{product.description}</p>

                    <div className="flex items-baseline gap-4 mt-6">
                        {onSale ? (
                            <>
                                <span className="text-4xl font-bold text-red-600">EGP {Number(product.salePrice || 0).toFixed(2)}</span>
                                <span className="text-xl text-gray-500 line-through">EGP {Number(product.price || 0).toFixed(2)}</span>
                            </>
                        ) : (
                           <span className="text-4xl font-bold text-gray-800">EGP {Number(product.price || 0).toFixed(2)}</span>
                        )}
                    </div>
                    
                    {product.quantity > 0 ? (
                        <button onClick={() => onAddToCart(product)} className="w-full mt-8 py-3 px-4 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d] shadow-md hover:shadow-lg transition-all text-lg">
                            Add to Cart
                        </button>
                    ) : (
                        <div className="mt-8">
                            <button className="w-full py-3 px-4 bg-gray-400 text-white font-semibold rounded-md cursor-not-allowed">
                                Out of Stock
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div id="reviews">
                <ReviewsSection {...reviewProps} product={product} />
            </div>

            <div className="mt-24">
                <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">More Products</h2>
                <FeaturedProductCarousel
                    products={relatedProducts}
                    onProductClick={onProductClick}
                    wishlist={wishlist}
                    onToggleWishlist={onToggleWishlist}
                />
            </div>
        </div>
    );
};

export default ProductDetailView;

