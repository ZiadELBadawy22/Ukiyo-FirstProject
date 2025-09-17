import React from 'react';

const ProductCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col aspect-square animate-pulse">
        <div className="w-full h-3/5 bg-gray-300"></div>
        <div className="p-2 flex flex-col flex-grow">
            <div className="flex-grow">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-1/3 mt-2"></div>
        </div>
    </div>
);

export default ProductCardSkeleton;
