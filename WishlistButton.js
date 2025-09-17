import React from 'react';

const WishlistButton = ({ product, onToggleWishlist, isWishlisted }) => {
    const handleClick = (e) => {
        e.stopPropagation();
        onToggleWishlist(product, isWishlisted);
    };

    return (
        <button
            onClick={handleClick}
            // --- MODIFIED: Background is now fully transparent, with a subtle glow on hover ---
            className="absolute top-2 right-2 p-2 rounded-full transition-colors hover:bg-black/20 z-10"
            aria-label="Toggle Wishlist"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-white" // Icon color is now white for better contrast
                fill={isWishlisted ? 'currentColor' : 'none'} 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={1.5} // A slightly thinner stroke for a more refined look
            >
                {/* --- MODIFIED: A higher-quality, smoother SVG path for the heart --- */}
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                />
            </svg>
        </button>
    );
};

export default WishlistButton;

