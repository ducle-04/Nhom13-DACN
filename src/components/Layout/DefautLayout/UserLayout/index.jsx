import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function UserLayout({ children }) {
    const location = useLocation();
    const hideHeaderAndFooter = ['/login', '/register'].includes(location.pathname);

    return (
        <div className='font-Montserrat'>
            {!hideHeaderAndFooter && <Header />}
            <div className='mx-2 xl:mx-20'>
                {children}
            </div>
            {!hideHeaderAndFooter && <Footer />}
        </div>
    );
}

export default UserLayout;