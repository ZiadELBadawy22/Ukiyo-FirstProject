import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * This component intelligently handles the window's scroll position.
 * It scrolls to the top ONLY when the user clicks a new link (a "PUSH" action).
 * It does nothing on "POP" actions (back/forward browser buttons), allowing
 * the browser to restore the previous scroll position automatically.
 */
function ScrollManager() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return null; // This component does not render any HTML.
}

export default ScrollManager;
