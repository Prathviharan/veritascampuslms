import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to ensure the route has fully loaded
    const scrollToTop = () => {
      // Try smooth scrolling first
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } catch (error) {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
      
      // Additional fallback to ensure scrolling works
      setTimeout(() => {
        if (window.scrollY > 0) {
          window.scrollTo(0, 0);
        }
      }, 100);
    };

    // Execute after a small delay to let the route fully mount
    const timer = setTimeout(scrollToTop, 0);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
