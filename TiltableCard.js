import React, { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';

const TiltableCard = ({ children, options }) => {
    const tiltRef = useRef(null);

    useEffect(() => {
        if (tiltRef.current) {
            VanillaTilt.init(tiltRef.current, options);
        }
        // Cleanup function to destroy the tilt instance when the component unmounts
        return () => {
            if (tiltRef.current && tiltRef.current.vanillaTilt) {
                tiltRef.current.vanillaTilt.destroy();
            }
        };
    }, [options]);

    return (
        <div ref={tiltRef} style={{ transformStyle: 'preserve-3d' }}>
            {children}
        </div>
    );
};

export default TiltableCard;
