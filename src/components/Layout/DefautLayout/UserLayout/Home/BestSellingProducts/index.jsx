import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, X, ArrowRight } from 'lucide-react';
import axios from 'axios';

const BestSellingProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const calculateDiscount = (original, discounted) => {
        if (!original || discounted >= original) return null;
        const discountPercent = Math.round(((original - discounted) / original) * 100);
        return `Giảm ${discountPercent}%`;
    };

    const fetchBestSelling = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8080/api/products', { timeout: 5000 });
            const rawProducts = Array.isArray(res.data) ? res.data : res.data.products || [];
            const bestSellers = rawProducts
                .filter(p => p.categoryName?.toLowerCase() === 'bestseller')
                .map(product => ({
                    id: product.id || Date.now() + Math.random(),
                    name: product.name || 'Không tên',
                    img: product.img || '/images/placeholder.jpg',
                    originalPrice: product.originalPrice || 0,
                    discountedPrice: product.discountedPrice || product.originalPrice || 0,
                    discount: calculateDiscount(product.originalPrice, product.discountedPrice),
                }));
            setProducts(bestSellers);
            setError(null);
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Vui lòng đăng nhập để xem sản phẩm bán chạy.');
                navigate('/login');
            } else {
                setError('Không thể tải danh sách sản phẩm bán chạy. Vui lòng thử lại sau.');
                console.error('Lỗi:', err.response?.data || err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBestSelling();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-amber-400 rounded-full animate-spin animate-reverse"></div>
                    </div>
                    <div className="backdrop-blur-sm bg-white/20 rounded-2xl p-6 shadow-xl">
                        <p className="text-slate-700 text-xl font-medium">Đang tải sản phẩm bán chạy...</p>
                        <p className="text-slate-500 text-sm mt-2">Vui lòng chờ trong giây lát</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <motion.div
                    className="text-center p-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md mx-4 border border-orange-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <X className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Oops! Có lỗi xảy ra</h3>
                    <p className="text-red-600 text-lg mb-6 leading-relaxed">{error}</p>
                    <button
                        onClick={() => fetchBestSelling()}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold transition-all duration-300 hover:from-orange-600 hover:to-amber-700 hover:shadow-lg transform hover:scale-105"
                    >
                        Thử lại
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.section
            className="py-20 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 relative overflow-hidden"
            id="best-selling-products"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        <span className="text-orange-600 font-semibold text-sm tracking-[0.3em] uppercase px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-orange-100">
                            Bán chạy nhất
                        </span>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                    </div>
                    <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-8 font-montserrat tracking-tight leading-tight">
                        Sản Phẩm Bán Chạy FoodieHub
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        <p className="text-slate-700 text-2xl leading-relaxed mb-6">
                            Khám phá những món ăn được yêu thích nhất tại FoodieHub
                        </p>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Hương vị chuẩn ngon, chất lượng đảm bảo – đặt ngay để thưởng thức!
                        </p>
                    </div>
                </motion.div>

                {products.length === 0 ? (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <ShoppingCart className="w-16 h-16 text-gray-400" />
                        </div>
                        <div className="backdrop-blur-sm bg-white/60 rounded-3xl p-10 max-w-md mx-auto shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Chưa có sản phẩm bán chạy</h3>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Hiện tại chưa có sản phẩm bán chạy nào. Hãy quay lại sau nhé!
                            </p>
                            <Link
                                to="/menu"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold transition-all duration-300 hover:from-orange-600 hover:to-amber-700 hover:shadow-lg transform hover:scale-105 group"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Xem thực đơn
                                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transition-all duration-500 ease-in-out border border-white/20 hover:shadow-2xl"
                                whileHover={{ scale: 1.02, y: -12 }}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                    <motion.img
                                        src={product.img}
                                        alt={product.name}
                                        className="w-full h-56 object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                                        loading="lazy"
                                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                    />
                                </div>
                                <div className="p-8">
                                    <motion.h3
                                        className="text-2xl font-bold text-gray-900 mb-4 transition-all duration-300 group-hover:text-orange-600 line-clamp-2"
                                        whileHover={{ x: 4 }}
                                    >
                                        {product.name}
                                    </motion.h3>
                                    <div className="flex items-center space-x-3 mb-4">
                                        <p className="text-gray-600 line-through text-lg">
                                            {product.originalPrice.toLocaleString('vi-VN')} VNĐ
                                        </p>
                                        <motion.p
                                            className="text-orange-600 font-bold text-xl"
                                            transition={{ duration: 0.3 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {product.discountedPrice.toLocaleString('vi-VN')} VNĐ
                                        </motion.p>
                                    </div>
                                    {product.discount && (
                                        <p className="text-sm text-orange-600 font-semibold mb-6">{product.discount}</p>
                                    )}
                                    <Link
                                        to="/menu"
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold transition-all duration-300 hover:from-orange-600 hover:to-amber-700 hover:shadow-lg group-hover:shadow-xl transform hover:scale-105 group/button"
                                    >
                                        <motion.div
                                            className="flex items-center"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            Đặt ngay
                                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/button:translate-x-1" />
                                        </motion.div>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default BestSellingProducts;