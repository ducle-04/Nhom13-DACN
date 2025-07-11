import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

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

    // Lấy tham số search từ URL
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';

    // Lấy sản phẩm, loại sản phẩm và danh mục từ backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Lấy danh sách sản phẩm
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

                // Lấy danh sách loại sản phẩm
                const productTypeResponse = await axios.get('http://localhost:8080/api/product-types', {
                    timeout: 5000,
                });
                setProductTypes(productTypeResponse.data);

                // Lấy danh sách danh mục
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

    // Lọc sản phẩm dựa trên searchQuery, loại sản phẩm, danh mục và khoảng giá
    useEffect(() => {
        let result = [...products];

        // Ưu tiên lọc theo searchQuery nếu có
        if (searchQuery) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else {
            // Lọc theo loại sản phẩm
            if (selectedProductType !== 'Tất cả') {
                result = result.filter(product =>
                    product.productTypeName.toLowerCase() === selectedProductType.toLowerCase()
                );
            }

            // Lọc theo danh mục
            if (selectedCategory !== 'Tất cả') {
                result = result.filter(product =>
                    product.categoryName.toLowerCase() === selectedCategory.toLowerCase()
                );
            }

            // Lọc theo khoảng giá
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

    // Tải lại danh sách sản phẩm khi xóa bộ lọc
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

    const calculateDiscount = (originalPrice, discountedPrice) => {
        const origPrice = parseInt(originalPrice);
        const discPrice = parseInt(discountedPrice);
        if (origPrice === discPrice || origPrice <= 0) return 0;
        return Math.round(((origPrice - discPrice) / origPrice) * 100);
    };

    const addToCart = (product) => {
        console.log('Đã thêm vào giỏ hàng:', product);
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
            {/* Header Section với hiệu ứng gradient động */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 shadow-lg relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                {/* Background decorative elements */}
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
                {/* Products Section */}
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
                                        {/* Discount Badge */}
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

                                        {/* Top gradient line */}
                                        <div className="w-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto group-hover:w-full transition-all duration-700 rounded-b-full"></div>

                                        {/* Product Image */}
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={product.img}
                                                alt={product.name}
                                                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                            />
                                            {/* Overlay gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-6 text-center">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 transition-all duration-300 group-hover:text-amber-600">
                                                {product.name}
                                            </h3>

                                            {/* Rating */}
                                            <div className="flex justify-center items-center mb-4">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className="text-lg">
                                                            {i < 4 ? '★' : '☆'}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="flex justify-center items-center space-x-3 mb-6">
                                                <p className="text-gray-400 line-through text-sm">{parseInt(product.originalPrice).toLocaleString('vi-VN')}đ</p>
                                                <p className="text-red-500 font-bold text-xl">{parseInt(product.discountedPrice).toLocaleString('vi-VN')}đ</p>
                                            </div>

                                            {/* Add to Cart Button */}
                                            <motion.button
                                                onClick={() => addToCart({ id: product.id, name: product.name, price: parseInt(product.discountedPrice), quantity: 1, image: product.img })}
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

                {/* Filter Sidebar */}
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

                    {/* Product Type Filter */}
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

                    {/* Category Filter */}
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

                    {/* Price Range Filter */}
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
                                            transition={{ type: "spring", stiffness: 200 }}
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