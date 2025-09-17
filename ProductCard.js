import React, { useState, useCallback, useRef } from 'react';
import StarRating from './StarRating';
import WishlistButton from './WishlistButton';

const ProductCard = ({ product, onProductClick, isWishlisted, onToggleWishlist }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const getImages = useCallback(() => {
        if (product?.imageUrls?.length > 0) {
            return product.imageUrls;
        }
        return ['https://placehold.co/600x600/cccccc/ffffff?text=No+Image'];
    }, [product]);

    const images = getImages();

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        e.stopPropagation();
        if (touchStartX.current - touchEndX.current > 75) {
            setCurrentIndex(prev => (prev + 1) % images.length);
        } else if (touchEndX.current - touchStartX.current > 75) {
            setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
        }
    };

    const onSale = product.salePrice && product.salePrice < product.price;
    if (!product) return null;

    return (
        <div
            // --- MODIFIED: Removed backdrop-blur and adjusted opacity for performance ---
            className="bg-[#b08d57]/70 border border-white/20 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl group cursor-pointer flex flex-col aspect-[4/5]"
            onClick={() => onProductClick(product)}
        >
             <div
                className="relative w-full h-4/5 overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
             >
                {onSale && <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">SALE</div>}
                
                <WishlistButton
                    product={product}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={onToggleWishlist}
                />

                <div className="flex h-full transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)`}}>
                    {images.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover flex-shrink-0"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/cccccc/ffffff?text=Image+Error'; }}
                        />
                    ))}
                </div>
            </div>
            <div className="p-2 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-base sm:text-lg font-bold font-serif text-white overflow-hidden line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={product.averageRating} size="sm" />
                        {product.reviewCount > 0 && (
                            <span className="text-xs text-gray-200">({product.reviewCount})</span>
                        )}
                    </div>
                </div>
                <div className="flex items-center pt-1">
                    <div className="flex items-center gap-1">
                        {onSale ? (
                            <>
                                <span className="text-base sm:text-lg font-bold text-red-500">EGP {Number(product.salePrice || 0).toFixed(2)}</span>
                                <span className="text-xs text-gray-200 line-through">EGP {Number(product.price || 0).toFixed(2)}</span>
                            </>
                        ) : (
                           <span className="text-base sm:text-lg font-bold text-white">EGP {Number(product.price || 0).toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

