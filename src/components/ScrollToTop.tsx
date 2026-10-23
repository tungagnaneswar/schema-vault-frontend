import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window to the top on every route change.
 * Must be rendered inside <BrowserRouter> to access useLocation.
 *
 * Exception: if the new URL contains a hash (e.g. /changelog#v1.2.0),
 * we let the browser handle the anchor scroll naturally instead of
 * overriding it with a jump to (0, 0).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, let the browser scroll to the anchor.
    // If there's no hash, always start at the top of the new page.
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
}
