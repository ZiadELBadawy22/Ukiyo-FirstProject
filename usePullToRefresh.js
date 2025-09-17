import { useState, useEffect } from 'react';

// --- MODIFIED: Increased the pull distance required to trigger a refresh ---
const PULL_THRESHOLD = 180; // This now represents a full 360-degree spin

const usePullToRefresh = () => {
    const [pullStartY, setPullStartY] = useState(0);
    const [pullPosition, setPullPosition] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const handleTouchStart = (e) => {
            if (window.scrollY === 0 && !isRefreshing) {
                setPullStartY(e.touches[0].clientY);
            }
        };

        const handleTouchMove = (e) => {
            if (pullStartY === 0 || isRefreshing) return;

            const currentY = e.touches[0].clientY;
            const diff = currentY - pullStartY;

            if (diff > 0) {
                // Prevent pulling past the threshold visually
                setPullPosition(Math.min(diff, PULL_THRESHOLD + 40)); 
            }
        };

        const handleTouchEnd = () => {
            if (pullStartY === 0 || isRefreshing) return;

            if (pullPosition >= PULL_THRESHOLD) {
                setIsRefreshing(true);
                setTimeout(() => {
                    window.location.reload();
                }, 1200);
            } else {
                // If not pulled far enough, reset
                setPullPosition(0);
                setPullStartY(0);
            }
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [pullStartY, pullPosition, isRefreshing]);

    return { isRefreshing, pullPosition };
};

export default usePullToRefresh;

