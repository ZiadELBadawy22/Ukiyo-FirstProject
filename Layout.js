import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import useScrollToTop from '../hooks/useScrollToTop';

// A subtle, clean cross-fade animation for smoother page transitions
const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
};

const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
};

const Layout = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  // This custom hook ensures new pages start at the top
  useScrollToTop();

  const showBackButton = location.pathname !== "/";

  const handleBackClick = () => {
    navigate(-1); // Uses browser history to go back
  };
  
  // When a new announcement is fetched from the database, show the banner again
  useEffect(() => {
    if (props.announcement?.isActive) {
        setIsBannerVisible(true);
    }
  }, [props.announcement]);

  return (
    // This div is transparent, allowing the body background from index.css to show through
    <div>
      <Header {...props} showBackButton={showBackButton} onBackClick={handleBackClick} />
      
      {/* --- MODIFIED: Banner is now below the header, bigger, and has larger text --- */}
      {props.announcement?.isActive && isBannerVisible && (
        <div className="bg-[#b08d57] text-white text-center p-3 text-base font-semibold relative shadow-md">
            <span>{props.announcement.text}</span>
            <button 
                onClick={() => setIsBannerVisible(false)}
                className="absolute top-0 right-0 mt-2 mr-4 text-white hover:text-gray-200 text-2xl"
                aria-label="Close banner"
            >
                &times;
            </button>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname} // This key is crucial for AnimatePresence to detect page changes
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Outlet /> {/* Your page components (ShopPage, ProductPage, etc.) are rendered here */}
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Layout;

