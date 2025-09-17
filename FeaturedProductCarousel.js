import React, { useRef, useEffect, useState } from 'react';
import ProductCard from './ProductCard';

// --- RENAMED: from ProductCarousel to FeaturedProductCarousel ---
const FeaturedProductCarousel = ({ products, onProductClick, wishlist, onToggleWishlist }) => {
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
        stopAutoScroll();
        intervalRef.current = setInterval(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 1) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scroll(clientWidth / 2);
                }
            }
        }, 3000);
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
        }, 30000);
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
            <button
                onClick={() => scroll(-300)}
                className="hidden md:block absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Scroll left"
            >
                ‹
            </button>
            <button
                onClick={() => scroll(300)}
                className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Scroll right"
            >
                ›
            </button>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default FeaturedProductCarousel;
