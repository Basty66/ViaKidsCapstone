import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        const main = document.querySelector('main');
        if (main) {
            main.style.opacity = '0';
            main.style.transform = 'translateY(10px)';
            requestAnimationFrame(() => {
                main.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                main.style.opacity = '1';
                main.style.transform = 'translateY(0)';
            });
        }
    }, [location.pathname]);

    return children;
};
