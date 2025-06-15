import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import banner1Img from '../../../assets/images/product/garan-1.jpg';
import banner2Img from '../../../assets/images/product/banner-2.jpg';
import banner3Img from '../../../assets/images/product/banner-3.jpg';
import menuCategories from '../../../data/menuCategories';
import promotions from '../../../data/promotions';
import featuredProducts from '../../../data/featuredProducts';
import newProducts from '../../../data/newProducts';
import bestSellingProducts from '../../../data/bestSellingProducts';

function Home() {
    // Dữ liệu slider
    const sliderImages = [
        { src: banner1Img },
        { src: banner2Img },
        { src: banner3Img },
    ];

    // Dữ liệu cho Voucher
    const vouchers = [
        { code: 'GIAM20K', description: 'Giảm 20K cho đơn từ 100K', expiry: 'Hết hạn: 30/06/2025' },
        { code: 'FREESHIP', description: 'Miễn phí giao hàng cho đơn từ 150K', expiry: 'Hết hạn: 30/06/2025' },
        { code: 'GIAM50K', description: 'Giảm 50K cho đơn từ 200K', expiry: 'Hết hạn: 20/06/2025' },
    ];

    // Dữ liệu cho Ảnh quảng cáo (Ưu Đãi Đặc Biệt)
    const advertisementImages = [
        { src: '/images/Product/quangcao-1.jpg', alt: 'Quảng Cáo 1' },
        { src: '/images/Product/quangcao-2.jpg', alt: 'Quảng Cáo 2' },
    ];

    // Dữ liệu cho Quảng Cáo (mới)
    const additionalAdvertisement = {
        src: '/images/Product/quangcao.jpg',
        alt: 'Quảng Cáo Khuyến Mãi',
    };

    const [currentSlide, setCurrentSlide] = useState(0);
    const location = useLocation();
    // Tự động chuyển slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [sliderImages.length]);

    // Cuộn đến phần khuyến mãi khi đường dẫn là /promotions
    useEffect(() => {
        if (location.pathname === '/promotions') {
            const promotionsSection = document.getElementById('promotions');
            if (promotionsSection) {
                promotionsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.pathname]); // Kích hoạt khi đường dẫn thay đổi

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const slideVariants = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeInOut' } },
        exit: { opacity: 0, x: -100, transition: { duration: 0.7, ease: 'easeInOut' } },
    };

    return (
        <div className="w-full">
            {/* Slider */}
            <div className="relative h-[500px] lg:h-[600px] overflow-hidden">
                <AnimatePresence>
                    {sliderImages.map((slide, index) => (
                        index === currentSlide && (
                            <motion.div
                                key={index}
                                className="absolute w-full h-full"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Link to="/menu">
                                    <img
                                        src={slide.src}
                                        alt={`Slide ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </Link>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                    onClick={goToPrevSlide}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                >
                    <ChevronLeft className="w-8 h-8 text-gray-900" />
                </button>
                <button
                    onClick={goToNextSlide}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                >
                    <ChevronRight className="w-8 h-8 text-gray-900" />
                </button>

                {/* Navigation Dots */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    {sliderImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-amber-400 scale-125' : 'bg-white/60 hover:bg-white/90'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Lựa chọn thực đơn */}
            <motion.section
                className="py-24 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-orange-300/20 to-yellow-300/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-amber-200/25 to-orange-200/25 rounded-full blur-2xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Enhanced Header */}
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Subtitle */}
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                            <span className="text-orange-600 font-medium text-sm tracking-[0.2em] uppercase">
                                Khám Phá Hương Vị
                            </span>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        </div>

                        {/* Main Title */}
                        <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat tracking-tight leading-tight">
                            Lựa Chọn Thực Đơn
                        </h2>

                        {/* Description */}
                        <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
                            Từ những món ăn truyền thống đến hiện đại, chúng tôi mang đến cho bạn trải nghiệm ẩm thực đa dạng và phong phú
                        </p>
                    </motion.div>

                    {/* Modern Menu Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
                        {menuCategories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group relative"
                            >
                                <Link
                                    to="/menu"
                                    className="block"
                                >
                                    {/* Card Container */}
                                    <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 group-hover:border-orange-200/50">
                                        {/* Gradient Background on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-amber-400/5 to-yellow-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                        {/* Image Container */}
                                        <div className="relative mb-6">
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500 scale-110"></div>

                                            {/* Main Image */}
                                            <motion.div
                                                className="relative z-10"
                                                whileHover={{ scale: 1.1, rotate: 3 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            >
                                                <img
                                                    src={category.img}
                                                    alt={category.name}
                                                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300"
                                                />
                                            </motion.div>

                                            {/* Decorative Ring */}
                                            <div className="absolute inset-0 rounded-full border-2 border-orange-200/30 group-hover:border-orange-400/50 transition-all duration-500 scale-125"></div>
                                        </div>

                                        {/* Category Name */}
                                        <div className="relative z-10 text-center">
                                            <h3 className="text-slate-800 font-bold text-lg md:text-xl group-hover:text-orange-600 transition-all duration-300 mb-2">
                                                {category.name}
                                            </h3>

                                            {/* Decorative Underline */}
                                            <div className="w-0 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto group-hover:w-8 transition-all duration-500 rounded-full"></div>
                                        </div>

                                        {/* Floating Action Indicator */}
                                        <motion.div
                                            className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                            whileHover={{ scale: 1.2 }}
                                        >
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.div>
                                    </div>

                                    {/* Floating Particles */}
                                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500 animate-ping"></div>
                                    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700 animate-pulse"></div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Section */}
                    <motion.div
                        className="text-center mt-20"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/50 backdrop-blur-sm rounded-full border border-orange-200/50 shadow-lg">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full border-2 border-white"></div>
                                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full border-2 border-white"></div>
                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white"></div>
                            </div>
                            <span className="text-slate-700 font-medium">
                                Hơn 100+ món ăn đang chờ bạn khám phá
                            </span>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Modern Voucher Section */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <div className="w-[90%] mx-auto px-4 relative z-10">
                    {/* Modern Heading */}
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                            <span className="text-orange-400 font-medium text-lg tracking-wider uppercase">Đặc Quyền</span>
                            <div className="w-8 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 mb-4 font-montserrat tracking-tight">
                            Ưu Đãi Voucher
                        </h2>
                        <p className="text-slate-600 text-xl max-w-2xl mx-auto leading-relaxed">
                            Khám phá những ưu đãi độc quyền được thiết kế riêng cho bạn
                        </p>
                    </motion.div>

                    {/* Modern Voucher Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {vouchers.map((voucher, index) => (
                            <motion.div
                                key={index}
                                className="group relative"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                whileHover={{ y: -10 }}
                            >
                                {/* Glassmorphism Card */}
                                <div className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                                    {/* Gradient Border Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-pink-400/20 to-purple-400/20 rounded-3xl blur-sm group-hover:blur-none transition-all duration-500"></div>

                                    {/* Inner Content */}
                                    <div className="relative z-10">
                                        {/* Voucher Code with Modern Badge */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full">
                                                <span className="text-white font-bold text-sm tracking-wider uppercase">
                                                    Voucher
                                                </span>
                                            </div>
                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">%</span>
                                            </div>
                                        </div>

                                        {/* Voucher Code */}
                                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 mb-4 tracking-wide">
                                            {voucher.code}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-slate-600 mb-4 text-lg leading-relaxed">
                                            {voucher.description}
                                        </p>

                                        {/* Expiry with Icon */}
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                                            <span className="text-slate-500 text-sm">
                                                {voucher.expiry}
                                            </span>
                                        </div>

                                        {/* Modern CTA Button */}
                                        <motion.button
                                            className="w-full relative group/btn overflow-hidden bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl p-[2px]"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="bg-slate-900 rounded-2xl px-8 py-4 group-hover/btn:bg-transparent transition-all duration-300">
                                                <span className="relative z-10 text-white font-bold text-lg tracking-wide">
                                                    Nhận Ngay
                                                </span>
                                            </div>

                                            {/* Button Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-all duration-300 rounded-2xl blur-sm"></div>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-60"
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 2, repeat: Infinity }
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <p className="text-slate-600 mb-6 text-lg">
                            Còn nhiều ưu đãi hấp dẫn khác đang chờ bạn
                        </p>
                        <motion.button
                            className="px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-2xl text-white font-semibold hover:from-slate-700 hover:to-slate-600 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Xem Tất Cả Ưu Đãi
                        </motion.button>
                    </motion.div>
                </div>
            </motion.section>

            {/* Khuyến mãi */}
            <motion.section
                className="py-24 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50" id="promotions"
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
                                Ưu đãi hót
                            </span>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        </div>
                        <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat tracking-tight leading-snug">
                            Khuyến Mãi Hấp Dẫn
                        </h2>
                        <p className="text-slate-600 text-xl text-center max-w-3xl mb-6 mx-auto leading-relaxed">
                            Khám phá loạt ưu đãi cực lớn với giá cực tốt – chỉ có trong đợt này!
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promotions.map((product, index) => (
                            <motion.div
                                key={index}
                                className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
                                whileHover={{ scale: 1.03, y: -8 }}
                            >
                                <div className="w-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto group-hover:w-full transition-all duration-500 rounded-full"></div>
                                <motion.img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out mt-0.5"
                                    loading="lazy"
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
                                    <p className="text-sm text-amber-600 font-semibold mb-4">{product.discount}</p>
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
                </div>
            </motion.section>

            {/* Quảng Cáo (mới) */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 w-full advertisement-fullwidth"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <motion.img
                    src={additionalAdvertisement.src}
                    alt={additionalAdvertisement.alt}
                    className="w-full h-[300px] lg:h-[400px] object-cover"
                    loading="lazy"
                />
            </motion.section>

            {/* Sản phẩm nổi bật */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50"
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
                                Sản phẩm hot
                            </span>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        </div>
                        <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat tracking-tight leading-snug">
                            Thực Đơn Nổi Bật
                        </h2>
                        <p className="text-slate-600 text-xl text-center max-w-3xl mb-6 mx-auto leading-relaxed">
                            Những món ăn được thực khách yêu thích nhất – hương vị tuyệt vời, chất lượng khó cưỡng!
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                key={index}
                                className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
                                whileHover={{ scale: 1.03, y: -8 }}
                            >
                                <div className="w-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto group-hover:w-full transition-all duration-500 rounded-full"></div>
                                <motion.img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out mt-0.5 "
                                    loading="lazy"
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
                </div>
            </motion.section>

            {/* Sản phẩm mới */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50"
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
                        {/* Subtitle */}
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                            <span className="text-orange-600 font-medium text-sm tracking-[0.2em] uppercase">
                                Mới ra mắt
                            </span>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        </div>
                        <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat tracking-tight leading-snug">
                            Thử Ngay
                        </h2>
                        <p className="text-slate-600 text-xl text-center max-w-3xl mb-6 mx-auto leading-relaxed">
                            Thực đơn mới ra mắt – món ngon chuẩn vị, hấp dẫn ngay từ lần thử đầu tiên!
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newProducts.map((product, index) => (
                            <motion.div
                                key={index}
                                className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
                                whileHover={{ scale: 1.03, y: -8 }}
                            >
                                <div className="w-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto group-hover:w-full transition-all duration-500 rounded-full"></div>
                                <motion.img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out mt-1"
                                    loading="lazy"
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
                </div>
            </motion.section>

            {/* Ưu Đãi Đặc Biệt */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 w-full advertisement-fullwidth"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat text-center mb-6 tracking-tight leading-snug">
                    Ưu Đãi Đặc Biệt
                </h2>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {advertisementImages.map((ad, index) => (
                        <motion.img
                            key={index}
                            src={ad.src}
                            alt={ad.alt}
                            className="w-full h-[300px] lg:h-[400px] object-cover rounded-lg"
                            loading="lazy"

                        />
                    ))}
                </div>
            </motion.section>

            {/* Sản phẩm bán chạy */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bestSellingProducts.map((product, index) => (
                            <motion.div
                                key={index}
                                className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
                                whileHover={{ scale: 1.03, y: -8 }}
                            >
                                <div className="w-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto group-hover:w-full transition-all duration-500 rounded-full"></div>
                                <motion.img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out mt-0.5"
                                    loading="lazy"
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
                </div>
            </motion.section>
        </div>
    );
}

export default Home;