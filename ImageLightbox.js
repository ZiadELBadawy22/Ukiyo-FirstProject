import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion'; // Import motion for animations

const ImageLightbox = ({ data, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(data.index);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const nextImage = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % data.images.length);
    }, [data.images]);

    const prevImage = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + data.images.length) % data.images.length);
    }, [data.images]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 75) { // Swiped left
            nextImage();
        } else if (touchEndX.current - touchStartX.current > 75) { // Swiped right
            prevImage();
        }
    };
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextImage, prevImage, onClose]);

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div
                className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center overflow-hidden"
                onClick={e => e.stopPropagation()} // This stops clicks inside from closing the modal
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="flex items-center transition-transform duration-300 ease-in-out h-full w-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {data.images.map((url, index) => (
                        <div key={index} className="w-full h-full flex-shrink-0 flex items-center justify-center p-4">
                             <img
                                src={url}
                                alt="Enlarged product"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
            {/* FIX: Added e.stopPropagation() to ALL buttons to prevent the click from closing the modal */}
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-4 right-4 text-white text-4xl cursor-pointer">&times;</button>
            
            {data.images.length > 1 && (
                <>
                    <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full text-2xl">‹</button>
                    <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full text-2xl">›</button>
                </>
            )}
        </motion.div>
    );
};

export default ImageLightbox;

