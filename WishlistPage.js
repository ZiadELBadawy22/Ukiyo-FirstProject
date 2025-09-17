import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductList from '../components/ProductList';

const WishlistPage = ({ allProducts, wishlist, onToggleWishlist }) => {
    const navigate = useNavigate();

    // Filter the main product list to get the full details of wishlisted items
    const wishlistedProducts = allProducts.filter(product => wishlist.includes(product.id));

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight sm:text-4xl">My Wishlist</h2>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">Your favorite items, all in one place.</p>
            </div>
            {wishlistedProducts.length > 0 ? (
                <ProductList
                    products={wishlistedProducts}
                    onProductClick={handleProductClick}
                    onToggleWishlist={onToggleWishlist}
                    wishlist={wishlist}
                />
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
                    <Link to="/" className="mt-4 inline-block px-6 py-2 bg-[#b08d57] text-white font-semibold rounded-md hover:bg-[#9c7b4d]">
                        Find Your Favorites
                    </Link>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;