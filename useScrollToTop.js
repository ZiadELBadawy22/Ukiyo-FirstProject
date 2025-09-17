import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This is a custom hook that scrolls the window to the top on every page change.
const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This will scroll to the top of the page every time the URL changes.
    // The browser's native history will handle restoring the scroll on "back" clicks.
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This hook doesn't render any visible element.
};

export default useScrollToTop;

