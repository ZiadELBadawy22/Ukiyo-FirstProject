import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onProductClick, wishlist, onToggleWishlist }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
        {products.map(product => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onProductClick={onProductClick}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
            />
        ))}
    </div>
);

export default ProductList;