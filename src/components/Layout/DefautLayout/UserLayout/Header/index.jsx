import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Cart from '../Cart';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };
    // Animation for mobile menu
    const menuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    };

    // Common NavLink class for both desktop and mobile
    const navLinkClass = ({ isActive }) =>
        `px-4 py-2 text-gray-800 font-semibold text-base rounded-lg transition-colors duration-200 ${isActive
            ? 'bg-amber-500 text-white'
            : 'hover:bg-amber-500 hover:text-white'
        }`;

    const mobileNavLinkClass = ({ isActive }) =>
        `block px-4 py-3 text-gray-800 font-semibold text-lg rounded-lg transition-colors duration-200 ${isActive
            ? 'bg-gray-800 text-white'
            : 'hover:bg-gray-800 hover:text-white'
        }`;

    return (
        <>
            <nav className="bg-white shadow-sm sticky top-0 z-50 py-6">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-amber-500 tracking-wide font-montserrat"
                    >
                        FoodieHub
                    </Link>

                    {/* Toggle button for mobile */}
                    <button
                        className="lg:hidden text-gray-800 focus:outline-none"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-6" id="mainNavbar">
                        <ul className="flex space-x-4">
                            {[
                                { to: '/', label: 'Trang chủ' },
                                { to: '/menu', label: 'Thực đơn' },
                                { to: '/promotions', label: 'Chương trình khuyến mãi' },
                                { to: '/booking', label: 'Đặt bàn' },
                                { to: '/news', label: 'Tin tức' },
                                { to: '/about', label: 'Giới thiệu' },
                            ].map(({ to, label }) => (
                                <li key={to}>
                                    <NavLink to={to} className={navLinkClass}>
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        {/* Search and Icons */}
                        <div className="flex items-center space-x-2">
                            {/* Search Bar */}
                            <div className="relative">
                                <button className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14A6 6 0 108 2a6 6 0 000 12z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm món ăn..."
                                    className="pl-10 pr-3 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Login Icon */}
                            <Link to="/login" className="relative">
                                <svg className="w-6 h-6 text-gray-800 hover:text-blue-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </Link>

                            {/* Cart Icon */}
                            <button onClick={toggleCart}
                                className="relative"
                                aria-label="Mở giỏ hàng"
                            >
                                <svg className="w-6 h-6 text-gray-800 hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                className="lg:hidden fixed inset-0 bg-white bg-opacity-95 z-40 p-4"
                                variants={menuVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <button
                                    className="absolute top-4 right-4 text-gray-800 focus:outline-none"
                                    onClick={toggleMenu}
                                    aria-label="Close navigation"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Search and Icons Row */}
                                <div className="flex items-center mb-6 space-x-2">
                                    {/* Search Bar */}
                                    <div className="relative flex-1">
                                        <button className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14A6 6 0 108 2a6 6 0 000 12z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm món ăn..."
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                        />
                                    </div>

                                    {/* Login Icon */}
                                    <Link to="/login" className="relative">
                                        <svg className="w-6 h-6 text-gray-800 hover:text-blue-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </Link>

                                    {/* Cart Icon */}
                                    <button onClick={toggleCart}
                                        className="relative"
                                        aria-label="Mở giỏ hàng"
                                    >
                                        <svg className="w-6 h-6 text-gray-800 hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
                                    </button>
                                </div>

                                {/* Menu items */}
                                <ul className="flex flex-col mt-4 space-y-4">
                                    {[
                                        { to: '/', label: 'Trang chủ' },
                                        { to: '/menu', label: 'Thực đơn' },
                                        { to: '/promotions', label: 'Chương trình khuyến mãi' },
                                        { to: '/booking', label: 'Đặt bàn' },
                                        { to: '/news', label: 'Tin tức' },
                                        { to: '/about', label: 'Giới thiệu' },
                                    ].map(({ to, label }) => (
                                        <li key={to}>
                                            <NavLink
                                                to={to}
                                                className={mobileNavLinkClass}
                                                onClick={toggleMenu}
                                            >
                                                {label}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
            {/* Component Cart */}
            <Cart isOpen={isCartOpen} onClose={toggleCart} />
        </>


    );
}

export default Header;