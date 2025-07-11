import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import axios from 'axios';
import Cart from '../Cart';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [searchError, setSearchError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    // Kiểm tra trạng thái đăng nhập
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    // Xử lý đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsProfileOpen(false);
        navigate('/');
    };

    // Lấy sản phẩm từ backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products', {
                    timeout: 5000,
                });
                const enrichedProducts = response.data.products.map(product => ({
                    name: product.name,
                    originalPrice: product.originalPrice,
                    discountedPrice: product.discountedPrice,
                    img: product.img || '/images/placeholder.jpg',
                    category: product.category,
                }));
                setProducts(enrichedProducts);
                setSearchError(null);
            } catch (err) {
                setSearchError('Không thể tải dữ liệu tìm kiếm.');
            }
        };
        fetchProducts();
    }, []);

    // Lọc sản phẩm dựa trên searchQuery và tạo đề xuất
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
        } else {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered.slice(0, 5));
        }

        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setSuggestedProducts(shuffled.slice(0, 5));
    }, [searchQuery, products]);

    // Animation variants
    const menuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.2, staggerChildren: 0.05 },
        },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: { opacity: 1, y: 0 },
    };

    const navLinkClass = ({ isActive }) =>
        `px-4 py-2.5 text-gray-800 font-semibold text-base rounded-lg transition-all duration-300 ${isActive ? 'bg-amber-500 text-white shadow-md' : 'hover:bg-amber-500 hover:text-white hover:shadow-md'}`;

    const mobileNavLinkClass = ({ isActive }) =>
        `block px-4 py-3 text-gray-800 font-semibold text-lg rounded-lg transition-all duration-300 ${isActive ? 'bg-gray-800 text-white shadow-md' : 'hover:bg-gray-800 hover:text-white hover:shadow-md'}`;

    return (
        <>
            <nav className="bg-white shadow-lg sticky top-0 z-50 py-4">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-amber-500 tracking-wide font-montserrat"
                    >
                        FoodieHub
                    </Link>

                    {/* Toggle button for mobile */}
                    <button
                        className="lg:hidden text-gray-800 focus:outline-none hover:text-amber-500 transition-colors duration-300"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-8" id="mainNavbar">
                        <ul className="flex space-x-6">
                            {[
                                { to: '/', label: 'Trang chủ' },
                                { to: '/menu', label: 'Thực đơn' },
                                { to: '/promotions', label: 'Khuyến mãi' },
                                { to: '/booking', label: 'Đặt bàn' },
                                { to: '/news', label: 'Tin tức' },
                                { to: '/about', label: 'Giới thiệu' },
                            ].map(({ to, label }) => (
                                <motion.li
                                    key={to}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <NavLink to={to} className={navLinkClass}>
                                        {label}
                                    </NavLink>
                                </motion.li>
                            ))}
                        </ul>

                        {/* Search and Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-colors duration-300" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm món ăn..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 w-56 transition-all duration-300 hover:bg-white hover:shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                />
                                <AnimatePresence>
                                    {isSearchFocused && (searchQuery || searchResults.length > 0 || suggestedProducts.length > 0) && (
                                        <motion.div
                                            className="absolute top-full left-0 mt-3 w-80 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden"
                                            variants={dropdownVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            {searchResults.length > 0 && (
                                                <>
                                                    <div className="px-4 py-2 bg-amber-50 text-amber-700 text-xs font-semibold flex items-center gap-2">
                                                        <Search className="w-4 h-4" />
                                                        Kết quả tìm kiếm
                                                    </div>
                                                    {searchResults.map((product, index) => (
                                                        <motion.div
                                                            key={`result-${index}`}
                                                            className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                                                            variants={itemVariants}
                                                        >
                                                            <Link
                                                                to={`/menu?search=${encodeURIComponent(product.name)}`}
                                                                className="flex items-center space-x-3"
                                                                onClick={() => setSearchQuery('')}
                                                            >
                                                                <img
                                                                    src={product.img}
                                                                    alt={product.name}
                                                                    className="w-12 h-12 object-cover rounded-md"
                                                                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                                                                    <p className="text-xs text-gray-500">{parseInt(product.discountedPrice).toLocaleString('vi-VN')}đ</p>
                                                                </div>
                                                            </Link>
                                                        </motion.div>
                                                    ))}
                                                </>
                                            )}
                                            {isSearchFocused && (!searchQuery || searchResults.length === 0) && suggestedProducts.length > 0 && (
                                                <>
                                                    <div className="px-4 py-2 bg-amber-50 text-amber-700 text-xs font-semibold flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        Đề xuất món ăn
                                                    </div>
                                                    {suggestedProducts.map((product, index) => (
                                                        <motion.div
                                                            key={`suggestion-${index}`}
                                                            className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                                                            variants={itemVariants}
                                                        >
                                                            <Link
                                                                to={`/menu?search=${encodeURIComponent(product.name)}`}
                                                                className="flex items-center space-x-3"
                                                                onClick={() => setSearchQuery('')}
                                                            >
                                                                <img
                                                                    src={product.img}
                                                                    alt={product.name}
                                                                    className="w-12 h-12 object-cover rounded-md"
                                                                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                                                                    <p className="text-xs text-gray-500">{parseInt(product.discountedPrice).toLocaleString('vi-VN')}đ</p>
                                                                </div>
                                                            </Link>
                                                        </motion.div>
                                                    ))}
                                                </>
                                            )}
                                            {searchQuery && searchResults.length === 0 && suggestedProducts.length === 0 && (
                                                <div className="px-4 py-4 text-gray-500 text-sm flex items-center gap-2">
                                                    <X className="w-4 h-4" />
                                                    Không tìm thấy sản phẩm.
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Login/Profile Icon */}
                            {isLoggedIn ? (
                                <div className="relative">
                                    <button
                                        className="relative text-gray-800 hover:text-amber-500 transition-colors duration-300"
                                        onClick={toggleProfile}
                                        aria-label="Tùy chọn tài khoản"
                                    >
                                        <User className="w-7 h-7" />
                                    </button>
                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                className="absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden"
                                                variants={dropdownVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                            >
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <Settings className="w-5 h-5 mr-2" />
                                                    Chỉnh sửa profile
                                                </Link>
                                                <button
                                                    className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut className="w-5 h-5 mr-2" />
                                                    Đăng xuất
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="relative text-gray-800 hover:text-amber-500 transition-colors duration-300 flex items-center gap-2"
                                >
                                    <User className="w-7 h-7" />
                                    <span className="text-base font-medium">Đăng nhập</span>
                                </Link>
                            )}

                            {/* Cart Icon */}
                            <button
                                onClick={toggleCart}
                                className="relative text-gray-800 hover:text-amber-500 transition-colors duration-300"
                                aria-label="Mở giỏ hàng"
                            >
                                <ShoppingCart className="w-7 h-7" />
                                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">0</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                className="lg:hidden fixed inset-0 bg-white bg-opacity-95 z-40 p-6"
                                variants={menuVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <button
                                    className="absolute top-4 right-4 text-gray-800 hover:text-amber-500 transition-colors duration-300"
                                    onClick={toggleMenu}
                                    aria-label="Close navigation"
                                >
                                    <X className="w-7 h-7" />
                                </button>

                                {/* Search and Icons Row */}
                                <div className="flex items-center mb-8 space-x-4">
                                    {/* Search Bar */}
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm món ăn..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition-all duration-300 hover:bg-white hover:shadow-sm"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onFocus={() => setIsSearchFocused(true)}
                                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                        />
                                        <AnimatePresence>
                                            {isSearchFocused && (searchQuery || searchResults.length > 0 || suggestedProducts.length > 0) && (
                                                <motion.div
                                                    className="absolute top-full left-0 mt-3 w-full bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden"
                                                    variants={dropdownVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                >
                                                    {searchResults.length > 0 && (
                                                        <>
                                                            <div className="px-4 py-2 bg-amber-50 text-amber-700 text-xs font-semibold flex items-center gap-2">
                                                                <Search className="w-4 h-4" />
                                                                Kết quả tìm kiếm
                                                            </div>
                                                            {searchResults.map((product, index) => (
                                                                <motion.div
                                                                    key={`result-${index}`}
                                                                    className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                                                                    variants={itemVariants}
                                                                >
                                                                    <Link
                                                                        to={`/menu?search=${encodeURIComponent(product.name)}`}
                                                                        className="flex items-center space-x-3"
                                                                        onClick={() => {
                                                                            setSearchQuery('');
                                                                            toggleMenu();
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={product.img}
                                                                            alt={product.name}
                                                                            className="w-12 h-12 object-cover rounded-md"
                                                                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                                                        />
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-800">{product.name}</p>
                                                                            <p className="text-xs text-gray-500">{parseInt(product.discountedPrice).toLocaleString('vi-VN')}đ</p>
                                                                        </div>
                                                                    </Link>
                                                                </motion.div>
                                                            ))}
                                                        </>
                                                    )}
                                                    {isSearchFocused && (!searchQuery || searchResults.length === 0) && suggestedProducts.length > 0 && (
                                                        <>
                                                            <div className="px-4 py-2 bg-amber-50 text-amber-700 text-xs font-semibold flex items-center gap-2">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                                Đề xuất món ăn
                                                            </div>
                                                            {suggestedProducts.map((product, index) => (
                                                                <motion.div
                                                                    key={`suggestion-${index}`}
                                                                    className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                                                                    variants={itemVariants}
                                                                >
                                                                    <Link
                                                                        to={`/menu?search=${encodeURIComponent(product.name)}`}
                                                                        className="flex items-center space-x-3"
                                                                        onClick={() => {
                                                                            setSearchQuery('');
                                                                            toggleMenu();
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={product.img}
                                                                            alt={product.name}
                                                                            className="w-12 h-12 object-cover rounded-md"
                                                                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                                                        />
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-800">{product.name}</p>
                                                                            <p className="text-xs text-gray-500">{parseInt(product.discountedPrice).toLocaleString('vi-VN')}đ</p>
                                                                        </div>
                                                                    </Link>
                                                                </motion.div>
                                                            ))}
                                                        </>
                                                    )}
                                                    {isSearchFocused && searchQuery && searchResults.length === 0 && suggestedProducts.length === 0 && (
                                                        <div className="px-4 py-4 text-gray-500 text-sm flex items-center gap-2">
                                                            <X className="w-4 h-4" />
                                                            Không tìm thấy sản phẩm.
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Login/Profile Icon */}
                                    {isLoggedIn ? (
                                        <div className="relative">
                                            <button
                                                className="relative text-gray-800 hover:text-amber-500 transition-colors duration-300"
                                                onClick={toggleProfile}
                                                aria-label="Tùy chọn tài khoản"
                                            >
                                                <User className="w-7 h-7" />
                                            </button>
                                            <AnimatePresence>
                                                {isProfileOpen && (
                                                    <motion.div
                                                        className="absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden"
                                                        variants={dropdownVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                    >
                                                        <Link
                                                            to="/profile"
                                                            className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors duration-200"
                                                            onClick={() => {
                                                                setIsProfileOpen(false);
                                                                toggleMenu();
                                                            }}
                                                        >
                                                            <Settings className="w-5 h-5 mr-2" />
                                                            Chỉnh sửa profile
                                                        </Link>
                                                        <button
                                                            className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors duration-200 w-full text-left"
                                                            onClick={() => {
                                                                handleLogout();
                                                                toggleMenu();
                                                            }}
                                                        >
                                                            <LogOut className="w-5 h-5 mr-2" />
                                                            Đăng xuất
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="relative text-gray-800 hover:text-amber-500 transition-colors duration-300 flex items-center gap-2"
                                            onClick={toggleMenu}
                                        >
                                            <User className="w-7 h-7" />
                                            <span className="text-base font-medium">Đăng nhập</span>
                                        </Link>
                                    )}

                                    {/* Cart Icon */}
                                    <button
                                        onClick={toggleCart}
                                        className="relative text-gray-800 hover:text-amber-500 transition-colors duration-300"
                                        aria-label="Mở giỏ hàng"
                                    >
                                        <ShoppingCart className="w-7 h-7" />
                                        <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">0</span>
                                    </button>
                                </div>

                                {/* Menu items */}
                                <ul className="flex flex-col mt-6 space-y-4">
                                    {[
                                        { to: '/', label: 'Trang chủ' },
                                        { to: '/menu', label: 'Thực đơn' },
                                        { to: '/promotions', label: 'Khuyến mãi' },
                                        { to: '/booking', label: 'Đặt bàn' },
                                        { to: '/news', label: 'Tin tức' },
                                        { to: '/about', label: 'Giới thiệu' },
                                    ].map(({ to, label }) => (
                                        <motion.li
                                            key={to}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 }}
                                        >
                                            <NavLink
                                                to={to}
                                                className={mobileNavLinkClass}
                                                onClick={toggleMenu}
                                            >
                                                {label}
                                            </NavLink>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
            <Cart isOpen={isCartOpen} onClose={toggleCart} />
        </>
    );
}

export default Header;