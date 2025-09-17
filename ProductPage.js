import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import ProductDetailView from '../components/ProductDetailView';
import ProductPageSkeleton from '../components/ProductPageSkeleton';

const ProductPage = (props) => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;
        setLoading(true);
        const docRef = doc(db, 'products', productId);

        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setProduct({ id: doc.id, ...doc.data() });
            } else {
                console.error("No such product!");
            }
            // A short delay prevents a jarring flash of content on fast connections
            setTimeout(() => setLoading(false), 250); 
        });

        return () => unsubscribe();
    }, [productId]);

    // This handles clicks on the "More Products" items at the bottom of the page
    const handleProductClick = (prod) => {
        navigate(`/product/${prod.id}`);
    };

    if (loading) {
        return <ProductPageSkeleton />; // Show the skeleton while the main product loads
    }

    if (!product) {
        return <div className="text-center py-20">Product not found.</div>;
    }

    return (
        <ProductDetailView 
            product={product} 
            onProductClick={handleProductClick} 
            {...props} 
        />
    );
};

export default ProductPage;

