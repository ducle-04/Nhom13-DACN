import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../../../Context/CartContext';
import Cart from '../../../components/Layout/DefautLayout/UserLayout/Cart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Menu() {
    const [products, setProducts] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState('Tất cả');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [selectedPriceRange, setSelectedPriceRange] = useState('Tất cả');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { addToCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const productResponse = await axios.get('http://localhost:8080/api/products', {
                    timeout: 5000,
                });
                const enrichedProducts = productResponse.data.products.map(product => ({
                    id: product.id,
                    name: product.name,
                    description: product.description || '',
                    originalPrice: product.originalPrice,
                    discountedPrice: product.discountedPrice || product.originalPrice,
                    img: product.img || '/images/placeholder.jpg',
                    productTypeId: product.productTypeId,
                    productTypeName: product.productTypeName || 'Không có',
                    status: product.status || 'AVAILABLE',
                    categoryId: product.categoryId,
                    categoryName: product.categoryName || 'Không có',
                }));
                setProducts(enrichedProducts);
                setFilteredProducts(enrichedProducts);

                const productTypeResponse = await axios.get('http://localhost:8080/api/product-types', {
                    timeout: 5000,
                });
                setProductTypes(productTypeResponse.data);

                const categoryResponse = await axios.get('http://localhost:8080/api/categories', {
                    timeout: 5000,
                });
                setCategories(categoryResponse.data);

                setError(null);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('Vui lòng đăng nhập để xem thực đơn.');
                    navigate('/login');
                } else {
                    setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
                    console.error('Lỗi:', err.response?.data || err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    useEffect(() => {
        let result = [...products];
        if (searchQuery) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else {
            if (selectedProductType !== 'Tất cả') {
                result = result.filter(product =>
                    product.productTypeName.toLowerCase() === selectedProductType.toLowerCase()
                );
            }
            if (selectedCategory !== 'Tất cả') {
                result = result.filter(product =>
                    product.categoryName.toLowerCase() === selectedCategory.toLowerCase()
                );
            }
            if (selectedPriceRange !== 'Tất cả') {
                let min, max;
                if (selectedPriceRange === 'under50000') {
                    min = 0;
                    max = 50000;
                } else if (selectedPriceRange === 'over150000') {
                    min = 150000;
                    max = Infinity;
                } else {
                    [min, max] = selectedPriceRange.split('-').map(Number);
                }
                result = result.filter(product => {
                    const price = parseInt(product.discountedPrice);
                    return price >= min && price <= max;
                });
            }
        }
        setFilteredProducts(result);
    }, [searchQuery, selectedProductType, selectedCategory, selectedPriceRange, products]);

    const resetFilters = async () => {
        setSelectedProductType('Tất cả');
        setSelectedCategory('Tất cả');
        setSelectedPriceRange('Tất cả');
        try {
            const response = await axios.get('http://localhost:8080/api/products', {
                timeout: 5000,
            });
            const enrichedProducts = response.data.products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description || '',
                originalPrice: product.originalPrice,
                discountedPrice: product.discountedPrice || product.originalPrice,
                img: product.img || '/images/placeholder.jpg',
                productTypeId: product.productTypeId,
                productTypeName: product.productTypeName || 'Không có',
                status: product.status || 'AVAILABLE',
                categoryId: product.categoryId,
                categoryName: product.categoryName || 'Không có',
            }));
            setProducts(enrichedProducts);
            setFilteredProducts(enrichedProducts);
            setError(null);
        } catch (err) {
            setError('Không thể tải lại danh sách sản phẩm. Vui lòng thử lại sau.');
            console.error('Lỗi:', err.response?.data || err.message);
        }
    };

    const priceRanges = [
        { value: 'Tất cả', label: 'Tất cả' },
        { value: 'under50000', label: 'Dưới 50.000' },
        { value: '50000-100000', label: '50.000-100.000' },
        { value: '100000-150000', label: '100.000-150.000' },
        { value: 'over150000', label: 'Trên 150.000' },
    ];

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: 'easeIn' } },
    };

    const calculateDiscount = (originalPrice, discountedPrice) => {
        const origPrice = parseInt(originalPrice);
        const discPrice = parseInt(discountedPrice);
        if (origPrice === discPrice || origPrice <= 0) return 0;
        return Math.round(((origPrice - discPrice) / origPrice) * 100);
    };

    const orderNow = (product) => {
        console.log('Đặt ngay:', product);
        setIsModalOpen(false);
    };

    const openProductModal = (product) => {
        setSelectedProduct(product);
        setQuantity(1);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        setQuantity(1);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleAddToCart = async (productId, quantity) => {
        try {
            await addToCart(productId, quantity);
            toast.success('Thêm vào giỏ hàng thành công!');
            setIsModalOpen(false);
            setIsCartOpen(true);
        } catch (error) {
            toast.error(`Lỗi: ${error.response?.data || 'Không thể thêm vào giỏ hàng'}`);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg">Đang tải...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <motion.div
                    className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-red-500 text-lg font-medium">{error}</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Modal chi tiết sản phẩm */}
            <AnimatePresence>
                {isModalOpen && selectedProduct && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header với nút đóng */}
                            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
                                <h2 className="text-2xl font-bold text-gray-900 truncate pr-4">{selectedProduct.name}</h2>
                                <button
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
                                    onClick={closeModal}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Nội dung chính */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                                {/* Cột trái - Hình ảnh */}
                                <div className="space-y-4">
                                    <div className="relative">
                                        <img
                                            src={selectedProduct.img}
                                            alt={selectedProduct.name}
                                            className="w-full h-80 lg:h-96 object-cover rounded-xl shadow-md"
                                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                        />
                                        {calculateDiscount(selectedProduct.originalPrice, selectedProduct.discountedPrice) > 0 && (
                                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                -{calculateDiscount(selectedProduct.originalPrice, selectedProduct.discountedPrice)}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Có sẵn trên:</h3>
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center bg-orange-100 text-orange-600 px-3 py-2 rounded-full">
                                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 11.66 11.34 14 14 14V22H10V14C6.69 14 4 11.31 4 8V6L10 0L14 4L18 8V10C18 12.21 16.21 14 14 14Z" />
                                                </svg>
                                                <span className="text-sm font-medium">ShopeeFood</span>
                                            </div>
                                            <div className="flex items-center bg-green-100 text-green-600 px-3 py-2 rounded-full">
                                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2ZM12 4.14L20 8.25V10C20 15.25 16.87 18.96 12 20.18C7.13 18.96 4 15.25 4 10V8.25L12 4.14ZM8 11L11 14L16 9L14.59 7.58L11 11.17L9.41 9.59L8 11Z" />
                                                </svg>
                                                <span className="text-sm font-medium">GrabFood</span>
                                            </div>
                                            <div className="flex items-center bg-blue-100 text-blue-600 px-3 py-2 rounded-full">
                                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 7C13.11 7 14 7.89 14 9C14 10.11 13.11 11 12 11C10.89 11 10 10.11 10 9C10 7.89 10.89 7 12 7ZM16.24 7.76C15.07 6.59 13.54 6 12 6S8.93 6.59 7.76 7.76C6.59 8.93 6 10.46 6 12S6.59 15.07 7.76 16.24C8.93 17.41 10.46 18 12 18S15.07 17.41 16.24 16.24C17.41 15.07 18 13.54 18 12S17.41 8.93 16.24 7.76Z" />
                                                </svg>
                                                <span className="text-sm font-medium">Baemin</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-gray-600 leading-relaxed">
                                            {selectedProduct.description || 'Không có mô tả'}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Loại sản phẩm:</span>
                                            <span className="font-medium text-gray-900">{selectedProduct.productTypeName}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Danh mục:</span>
                                            <span className="font-medium text-gray-900">
                                                {selectedProduct.categoryName === 'FEATURED' ? 'Nổi bật' :
                                                    selectedProduct.categoryName === 'NEW' ? 'Mới' :
                                                        selectedProduct.categoryName === 'BESTSELLER' ? 'Bán chạy' :
                                                            selectedProduct.categoryName === 'PROMOTIONS' ? 'Giảm giá sâu' :
                                                                selectedProduct.categoryName || 'Không có'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Tình trạng:</span>
                                            <span className={`font-medium ${selectedProduct.status === 'AVAILABLE' ? 'text-green-600' :
                                                selectedProduct.status === 'OUT_OF_STOCK' ? 'text-red-600' : 'text-gray-600'}`}>
                                                {selectedProduct.status === 'AVAILABLE' ? 'Có sẵn' :
                                                    selectedProduct.status === 'OUT_OF_STOCK' ? 'Hết hàng' :
                                                        selectedProduct.status === 'DISCONTINUED' ? 'Ngừng kinh doanh' :
                                                            selectedProduct.status || 'Không xác định'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                {calculateDiscount(selectedProduct.originalPrice, selectedProduct.discountedPrice) > 0 && (
                                                    <span className="text-gray-400 line-through text-lg">
                                                        {parseInt(selectedProduct.originalPrice).toLocaleString('vi-VN')}đ
                                                    </span>
                                                )}
                                                <span className="text-red-500 font-bold text-2xl">
                                                    {parseInt(selectedProduct.discountedPrice).toLocaleString('vi-VN')}đ
                                                </span>
                                            </div>
                                            {calculateDiscount(selectedProduct.originalPrice, selectedProduct.discountedPrice) > 0 && (
                                                <span className="text-green-600 font-semibold">
                                                    Tiết kiệm {calculateDiscount(selectedProduct.originalPrice, selectedProduct.discountedPrice)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Số lượng:</h3>
                                        <div className="flex items-center justify-center space-x-4">
                                            <motion.button
                                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                                className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span className="text-lg font-semibold">-</span>
                                            </motion.button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-20 text-center border-2 border-gray-200 rounded-lg py-3 text-gray-700 font-semibold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                                                min="1"
                                            />
                                            <motion.button
                                                onClick={() => setQuantity(prev => prev + 1)}
                                                className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span className="text-lg font-semibold">+</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <motion.button
                                        onClick={() => handleAddToCart(selectedProduct.id, quantity)}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Thêm vào giỏ hàng
                                    </motion.button>
                                    <motion.button
                                        onClick={() => orderNow({
                                            id: selectedProduct.id,
                                            name: selectedProduct.name,
                                            price: parseInt(selectedProduct.discountedPrice),
                                            quantity: quantity,
                                            image: selectedProduct.img
                                        })}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Đặt ngay
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Giỏ hàng */}
            <Cart isOpen={isCartOpen} onClose={toggleCart} />

            {/* Header Section */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 shadow-lg relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10">
                    <motion.div
                        className="flex items-center justify-center gap-4 mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.div
                            className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"
                            initial={{ width: 0 }}
                            animate={{ width: '4rem' }}
                            transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                        <span className="text-orange-600 font-medium text-sm tracking-[0.2em] uppercase">
                            Tuyển chọn hấp dẫn
                        </span>
                        <motion.div
                            className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"
                            initial={{ width: 0 }}
                            animate={{ width: '4rem' }}
                            transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                    </motion.div>
                    <div className="container mx-auto px-4 text-center">
                        <motion.h1
                            className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat tracking-tight leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            Thực Đơn
                        </motion.h1>
                        <motion.p
                            className="text-slate-600 text-xl text-center max-w-4xl mb-8 mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            Khám phá những món ăn tuyệt vời được chế biến với tình yêu và sự tận tâm tại FoodieHub
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
                <section className="w-full lg:w-3/4">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingCart className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg">Không có sản phẩm nào phù hợp.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => {
                                const discount = calculateDiscount(product.originalPrice, product.discountedPrice);
                                return (
                                    <div
                                        key={product.id}
                                        className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl relative"
                                    >
                                        {discount > 0 && (
                                            <motion.div
                                                className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                                            >
                                                -{discount}%
                                            </motion.div>
                                        )}
                                        <div className="w-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto group-hover:w-full transition-all duration-700 rounded-b-full"></div>
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={product.img}
                                                alt={product.name}
                                                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <div className="p-6 text-center">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 transition-all duration-300 group-hover:text-amber-600">
                                                {product.name}
                                            </h3>
                                            <div className="flex justify-center items-center mb-4">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className="text-lg">
                                                            {i < 4 ? '★' : '☆'}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex justify-center items-center space-x-3 mb-6">
                                                {discount > 0 && (
                                                    <p className="text-gray-400 line-through text-sm">{parseInt(product.originalPrice).toLocaleString('vi-VN')}đ</p>
                                                )}
                                                <p className="text-red-500 font-bold text-xl">{parseInt(product.discountedPrice).toLocaleString('vi-VN')}đ</p>
                                            </div>
                                            <motion.button
                                                onClick={() => openProductModal(product)}
                                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ShoppingCart className="w-5 h-5 mr-2" />
                                                Đặt ngay
                                            </motion.button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
                <motion.aside
                    className="w-full lg:w-1/4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-orange-100 sticky top-6 h-fit"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-orange-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Bộ lọc</h2>
                        </div>
                        {(selectedProductType !== 'Tất cả' || selectedCategory !== 'Tất cả' || selectedPriceRange !== 'Tất cả') && (
                            <motion.button
                                onClick={resetFilters}
                                className="flex items-center text-sm text-red-500 hover:text-red-600 transition-colors duration-200 px-3 py-1 rounded-full hover:bg-red-50"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Xóa bộ lọc
                            </motion.button>
                        )}
                    </div>
                    <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-lg font-medium text-gray-700 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                            Loại sản phẩm
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <motion.button
                                onClick={() => setSelectedProductType('Tất cả')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedProductType === 'Tất cả'
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Tất cả
                            </motion.button>
                            {productTypes.map((type) => (
                                <motion.button
                                    key={type.id}
                                    onClick={() => setSelectedProductType(type.name)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedProductType === type.name
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + type.id * 0.1 }}
                                >
                                    {type.name}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-lg font-medium text-gray-700 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                            Danh mục
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <motion.button
                                onClick={() => setSelectedCategory('Tất cả')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === 'Tất cả'
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Tất cả
                            </motion.button>
                            {categories.map((category) => (
                                <motion.button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.name)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.name
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + category.id * 0.1 }}
                                >
                                    {category.name}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-lg font-medium text-gray-700 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                            Khoảng giá
                        </h3>
                        <div className="space-y-3">
                            {priceRanges.map((range, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => setSelectedPriceRange(range.value)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between ${selectedPriceRange === range.value
                                        ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-600 font-semibold shadow-md border border-orange-200'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                                        }`}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <span>{range.label}</span>
                                    {selectedPriceRange === range.value && (
                                        <motion.span
                                            className="text-orange-500 font-bold"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 200 }}
                                        >
                                            ✓
                                        </motion.span>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </motion.aside>
            </div>
        </div>
    );
}

export default Menu;