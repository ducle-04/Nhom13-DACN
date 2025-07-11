import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
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
                .filter(p => p.categoryName?.toLowerCase() === 'bestseller') // sửa nếu backend đặt khác
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
            <div className="w-full py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg">Đang tải...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <motion.div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-red-500 text-lg font-medium">{error}</p>
                    <button
                        onClick={() => fetchBestSelling()}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                    >
                        Thử lại
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.section
            className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50"
            id="best-selling-products"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
        >
            <div className="w-[96%] mx-auto px-4">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        <span className="text-orange-600 font-medium text-sm tracking-[0.2em] uppercase">
                            Bán chạy nhất
                        </span>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                    </div>
                    <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat tracking-tight leading-snug">
                        Thực Đơn Bán Chạy
                    </h2>
                    <p className="text-slate-600 text-xl text-center max-w-3xl mb-6 mx-auto leading-relaxed">
                        Những món ăn được thực khách lựa chọn nhiều nhất – chuẩn vị, chất lượng đảm bảo, luôn làm hài lòng vị giác.
                    </p>
                </motion.div>

                {products.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">Hiện chưa có sản phẩm bán chạy nào.</p>
                        <Link
                            to="/menu"
                            className="inline-flex items-center px-6 py-3 mt-4 bg-gradient-to-r from-amber-400 to-orange-600 text-white rounded-full font-semibold transition-all duration-300 hover:from-amber-500 hover:to-orange-700"
                        >
                            Xem thực đơn
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
                                whileHover={{ scale: 1.03, y: -8 }}
                            >
                                <div className="w-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto group-hover:w-full transition-all duration-500 rounded-full"></div>
                                <motion.img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out mt-0.5"
                                    loading="lazy"
                                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                />
                                <div className="p-6">
                                    <motion.h3
                                        className="text-xl font-bold text-gray-900 mb-3 transition-all duration-300 group-hover:text-amber-600 group-hover:-translate-y-1"
                                    >
                                        {product.name}
                                    </motion.h3>
                                    <div className="flex items-center space-x-3 mb-3 transition-all duration-300 group-hover:-translate-y-1">
                                        <p className="text-gray-600 line-through text-lg">
                                            {product.originalPrice.toLocaleString('vi-VN')} VNĐ
                                        </p>
                                        <motion.p
                                            className="text-amber-600 font-bold text-xl"
                                            transition={{ duration: 0.3 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {product.discountedPrice.toLocaleString('vi-VN')} VNĐ
                                        </motion.p>
                                    </div>
                                    {product.discount && (
                                        <p className="text-sm text-amber-600 font-semibold mb-4">{product.discount}</p>
                                    )}
                                    <Link
                                        to="/menu"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-600 text-white rounded-full font-semibold transition-all duration-300 group-hover:from-amber-500 group-hover:to-orange-700 group-hover:shadow-lg"
                                    >
                                        <motion.div
                                            className="flex items-center"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            Đặt ngay
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
