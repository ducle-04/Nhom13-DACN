import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Thêm Framer Motion cho animation

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Animation cho menu di động
    const menuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 py-3">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-gray-800 tracking-wide font-montserrat"
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

                {/* Menu */}
                <div className="hidden lg:flex lg:items-center lg:space-x-6" id="mainNavbar">
                    <ul className="flex space-x-4">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `px-4 py-2 text-gray-800 font-semibold text-base hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                }
                            >
                                Trang chủ
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/menu"
                                className={({ isActive }) =>
                                    `px-4 py-2 text-gray-800 font-semibold text-base hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                }
                            >
                                Thực đơn
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/promotions"
                                className={({ isActive }) =>
                                    `px-4 py-2 text-gray-800 font-semibold text-base hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                }
                            >
                                Chương trình khuyến mãi
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/booking"
                                className={({ isActive }) =>
                                    `px-4 py-2 text-gray-800 font-semibold text-base hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                }
                            >
                                Đặt bàn
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/news"
                                className={({ isActive }) =>
                                    `px-4 py-2 text-gray-800 font-semibold text-base hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                }
                            >
                                Tin tức
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    `px-4 py-2 text-gray-800 font-semibold text-base hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                }
                            >
                                Giới thiệu
                            </NavLink>
                        </li>
                    </ul>

                    {/* Search and Cart Icons */}
                    <div className="flex items-center space-x-3">
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
                        <Link to="/cart" className="relative">
                            <svg className="w-6 h-6 text-gray-800 hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile menu */}
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

                            {/* Search, Login, Cart Row */}
                            <div className="flex justify-between items-center mb-6">
                                {/* Search Bar */}
                                <div className="relative w-full max-w-xs">
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
                                <Link to="/login" className="ml-4 relative">
                                    <svg className="w-6 h-6 text-gray-800 hover:text-blue-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </Link>

                                {/* Cart Icon */}
                                <Link to="/cart" className="ml-4 relative">
                                    <svg className="w-6 h-6 text-gray-800 hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
                                </Link>
                            </div>

                            {/* Menu items */}
                            <ul className="flex flex-col mt-4 space-y-4">
                                <li>
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) =>
                                            `block px-4 py-3 text-gray-800 font-semibold text-lg hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                        }
                                        onClick={toggleMenu}
                                    >
                                        Trang chủ
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/menu"
                                        className={({ isActive }) =>
                                            `block px-4 py-3 text-gray-800 font-semibold text-lg hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                        }
                                        onClick={toggleMenu}
                                    >
                                        Thực đơn
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/promotions"
                                        className={({ isActive }) =>
                                            `block px-4 py-3 text-gray-800 font-semibold text-lg hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                        }
                                        onClick={toggleMenu}
                                    >
                                        Chương trình khuyến mãi
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/booking"
                                        className={({ isActive }) =>
                                            `block px-4 py-3 text-gray-800 font-semibold text-lg hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                        }
                                        onClick={toggleMenu}
                                    >
                                        Đặt bàn
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/news"
                                        className={({ isActive }) =>
                                            `block px-4 py-3 text-gray-800 font-semibold text-lg hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                        }
                                        onClick={toggleMenu}
                                    >
                                        Tin tức
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/about"
                                        className={({ isActive }) =>
                                            `block px-4 py-3 text-gray-800 font-semibold text-lg hover:bg-gray-800 hover:text-white rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-800 text-white' : ''}`
                                        }
                                        onClick={toggleMenu}
                                    >
                                        Giới thiệu
                                    </NavLink>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

export default Header;