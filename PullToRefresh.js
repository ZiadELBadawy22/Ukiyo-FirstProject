import React from 'react';

const PullToRefresh = ({ isRefreshing, pullPosition }) => {
    const topPosition = isRefreshing ? 20 : Math.min(pullPosition / 2.5, 70) - 50;
    const opacity = (pullPosition > 10 || isRefreshing) ? 1 : 0;
    
    // Rotation is now 2 degrees for every pixel pulled.
    // At a pull distance of 180px, the logo will have spun 360 degrees.
    const rotation = isRefreshing ? '' : `rotate(${pullPosition * 2}deg)`;

    return (
        <div
            className="fixed top-0 left-0 right-0 flex justify-center items-center"
            style={{
                transform: `translateY(${topPosition}px)`,
                zIndex: 20,
                transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                opacity: opacity
            }}
        >
            <img
                src="https://firebasestorage.googleapis.com/v0/b/ukiyo-store.firebasestorage.app/o/426A992F-FADE-4E00-9C0D-00196AF6AB4C.PNG?alt=media&token=7c404885-978c-4783-a799-fcbd447145af"
                alt="Refreshing"
                className={`h-12 w-12 filter drop-shadow-lg ${isRefreshing ? 'animate-spin' : ''}`}
                style={{ transform: rotation, transition: isRefreshing ? 'transform 0.5s ease-in-out' : 'none' }}
            />
        </div>
    );
};

export default PullToRefresh;

