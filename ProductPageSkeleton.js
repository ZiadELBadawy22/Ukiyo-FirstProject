import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductPageSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex flex-col gap-4">
                <div className="h-96 md:h-[550px] w-full bg-gray-300 rounded-lg"></div>
                <div className="flex justify-center gap-2">
                    <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
                    <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
                    <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
                </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gray-300 rounded w-3/4"></div>
                <div className="h-24 bg-gray-300 rounded w-full"></div>
                <div className="h-12 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-400 rounded w-full mt-4"></div>
            </div>
        </div>
        <div className="mt-24">
            <div className="h-8 bg-gray-300 rounded-md w-1/3 mx-auto mb-8"></div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
            </div>
        </div>
    </div>
);

export default ProductPageSkeleton;

