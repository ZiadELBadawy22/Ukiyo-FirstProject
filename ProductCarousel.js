import React, { useRef, useEffect, useState } from 'react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ products, onProductClick, wishlist, onToggleWishlist }) => {
    const scrollContainerRef = useRef(null);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);
    const [isInteracting, setIsInteracting] = useState(false);

    const scroll = (scrollOffset) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
        }
    };

    const startAutoScroll = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 1) { // -1 for precision
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scroll(clientWidth / 2); // Scroll by half the visible width
                }
            }
        }, 3000); // Change scroll speed here (in ms)
    };

    const stopAutoScroll = () => {
        clearInterval(intervalRef.current);
    };

    const handleInteraction = () => {
        setIsInteracting(true);
        stopAutoScroll();
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsInteracting(false);
        }, 30000); // 30-second timeout
    };

    useEffect(() => {
        if (!isInteracting) {
            startAutoScroll();
        }
        return () => {
            stopAutoScroll();
            clearTimeout(timeoutRef.current);
        };
    }, [isInteracting]);

    return (
        <div className="relative group">
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 space-x-4 hide-scrollbar"
                onMouseEnter={handleInteraction}
                onTouchStart={handleInteraction}
            >
                {products.map((product) => (
                    // --- MODIFIED: Changed width classes for a larger, consistent card size ---
                    <div key={product.id} className="snap-center flex-shrink-0 w-[45%] sm:w-[30%] md:w-[23%] lg:w-[20%]">
                        <ProductCard
                            product={product}
                            onProductClick={onProductClick}
                            isWishlisted={wishlist.includes(product.id)}
                            onToggleWishlist={onToggleWishlist}
                        />
                    </div>
                ))}
            </div>
            {/* Desktop Arrows */}
            <button
                onClick={() => scroll(-300)}
                className="hidden md:block absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                ‹
            </button>
            <button
                onClick={() => scroll(300)}
                className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                ›
            </button>
            {/* CSS to hide the scrollbar */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default ProductCarousel;

