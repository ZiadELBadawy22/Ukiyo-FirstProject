import React, { useRef, useEffect, useState } from 'react';

const HomepageCarousel = ({ banners }) => {
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
                    scroll(clientWidth);
                }
            }
        }, 4000); // Scroll every 4 seconds
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
        }, 30000); // Resume after 30 seconds of inactivity
    };

    useEffect(() => {
        if (!isInteracting) {
            startAutoScroll();
        }
        return () => {
            stopAutoScroll();
            clearTimeout(timeoutRef.current);
        };
    }, [isInteracting, banners]); // Restart scroll if banners change

    if (!banners || banners.length === 0) {
        return null;
    }
    
    // If only one banner, display it statically without arrows
    if (banners.length === 1) {
        const banner = banners[0];
        const BannerImage = () => <img src={banner.imageUrl} alt="Ukiyo Store Banner" className="w-full h-auto object-cover" />;
        return (
             <section className="max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                {banner.linkUrl ? (
                    <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-auto">
                        <BannerImage />
                    </a>
                ) : (
                    <BannerImage />
                )}
            </section>
        )
    }

    return (
        <div className="relative group max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg">
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
                onMouseEnter={handleInteraction}
                onTouchStart={handleInteraction}
            >
                {banners.map((banner, index) => (
                    <div key={index} className="snap-center flex-shrink-0 w-full">
                        {banner.linkUrl ? (
                             <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-auto">
                                <img src={banner.imageUrl} alt={`Ukiyo Banner ${index + 1}`} className="w-full h-auto object-cover" />
                            </a>
                        ) : (
                             <img src={banner.imageUrl} alt={`Ukiyo Banner ${index + 1}`} className="w-full h-auto object-cover" />
                        )}
                    </div>
                ))}
            </div>
            {/* Desktop Arrows */}
            <button
                onClick={() => scroll(-scrollContainerRef.current.clientWidth)}
                className="hidden md:block absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
                ‹
            </button>
            <button
                onClick={() => scroll(scrollContainerRef.current.clientWidth)}
                className="hidden md:block absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
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

export default HomepageCarousel;
