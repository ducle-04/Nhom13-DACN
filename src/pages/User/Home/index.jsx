import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import garanImg from '../../../assets/images/product/garan-1.png';

import menuCategories from '../../../data/menuCategories';
import promotions from '../../../data/promotions';
import featuredProducts from '../../../data/featuredProducts';
import newProducts from '../../../data/newProducts';
import bestSellingProducts from '../../../data/bestSellingProducts';


function Home() {
    // Dữ liệu slider
    const sliderImages = [
        {
            src: garanImg,
            title: 'Gà Rán Giòn Tan',
            description: 'Thưởng thức gà rán nóng hổi, lớp vỏ giòn rụm và đậm vị.',
        },
        {
            src: '/images/my-y.jpg',
            title: 'Mỳ Ý Sốt Cà Chua',
            description: 'Mỳ Ý dai ngon hòa quyện cùng sốt cà chua và thịt bằm.',
        },
        {
            src: '/images/pizza.jpg',
            title: 'Pizza Phô Mai Kéo Sợi',
            description: 'Pizza đậm đà với lớp phô mai béo ngậy và topping phong phú.',
        },
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
        { src: '/images/advertisement-2.jpg', alt: 'Quảng Cáo 2' },
    ];

    // Dữ liệu cho Quảng Cáo (mới)
    const additionalAdvertisement = {
        src: '/images/Product/quangcao-1.jpg',
        alt: 'Quảng Cáo Khuyến Mãi',
    };

    const [currentSlide, setCurrentSlide] = useState(0);

    // Tự động chuyển slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [sliderImages.length]);

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
                                <img
                                    src={slide.src}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 to-transparent">
                                    <motion.div
                                        className="text-center text-white max-w-5xl px-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                    >
                                        <h2 className="text-4xl lg:text-6xl font-bold font-montserrat mb-4 lg:mb-6 tracking-tight">{slide.title}</h2>
                                        <p className="text-lg lg:text-2xl mb-6 lg:mb-8">{slide.description}</p>
                                        <Link
                                            to="/menu"
                                            className="inline-block px-8 py-3 lg:px-10 lg:py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            Xem thực đơn
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                    onClick={goToPrevSlide}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                >
                    <ChevronLeft className="w-8 h-8 text-gray-800" />
                </button>
                <button
                    onClick={goToNextSlide}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                >
                    <ChevronRight className="w-8 h-8 text-gray-800" />
                </button>

                {/* Navigation Dots */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    {sliderImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-orange-500 scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Lựa chọn thực đơn */}
            <motion.section
                className="py-16 bg-gray-50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center font-montserrat">Lựa Chọn Thực Đơn</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                        {menuCategories.map((category, index) => (
                            <Link
                                key={index}
                                to="/menu"
                                className="group flex flex-col items-center text-center transition-all duration-300"
                            >
                                <motion.img
                                    src={category.img}
                                    alt={category.name}
                                    className="w-28 h-28 rounded-full object-cover mb-3 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-transform duration-300"
                                    whileHover={{ scale: 1.15 }}
                                />
                                <p className="text-gray-900 font-semibold text-lg">{category.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Voucher */}
            <motion.section
                className="py-16 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="w-[90%] mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center font-montserrat">Ưu Đãi Voucher</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vouchers.map((voucher, index) => (
                            <motion.div
                                key={index}
                                className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3 className="text-2xl font-bold text-red-600 mb-3">{voucher.code}</h3>
                                <p className="text-gray-700 mb-3 text-lg">{voucher.description}</p>
                                <p className="text-sm text-gray-500 mb-4">{voucher.expiry}</p>
                                <motion.button
                                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Lấy mã
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Khuyến mãi */}
            <motion.section
                className="py-16 bg-gray-50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="w-[96%] mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center font-montserrat">Khuyến Mãi Hấp Dẫn</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promotions.map((product, index) => (
                            <motion.div
                                key={index}
                                className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
                                whileHover={{ scale: 1.03, y: -8 }}
                            >
                                <motion.img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="p-6">
                                    <motion.h3
                                        className="text-xl font-bold text-gray-900 mb-3 transition-all duration-300 group-hover:text-red-600 group-hover:-translate-y-1"
                                    >
                                        {product.name}
                                    </motion.h3>
                                    <div className="flex items-center space-x-3 mb-3 transition-all duration-300 group-hover:-translate-y-1">
                                        <p className="text-gray-500 line-through text-lg">{product.originalPrice.toLocaleString('vi-VN')} VNĐ</p>
                                        <motion.p
                                            className="text-red-500 font-bold text-xl"
                                            transition={{ duration: 0.3 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {product.discountedPrice.toLocaleString('vi-VN')} VNĐ
                                        </motion.p>
                                    </div>
                                    <p className="text-sm text-red-500 font-semibold mb-4">{product.discount}</p>
                                    <Link
                                        to="/menu"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full font-semibold transition-all duration-300 group-hover:from-red-500 group-hover:to-red-600 group-hover:shadow-lg"
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
                className="py-16 bg-white w-full advertisement-fullwidth"
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
                className="py-16 bg-gray-50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="w-[96%] mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center font-montserrat">Sản Phẩm Nổi Bật</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                key={index}
                                className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
                                whileHover={{ scale: 1.03, y: -8 }}
                            >
                                <motion.img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="p-6">
                                    <motion.h3
                                        className="text-xl font-bold text-gray-900 mb-3 transition-all duration-300 group-hover:text-red-600 group-hover:-translate-y-1"
                                    >
                                        {product.name}
                                    </motion.h3>
                                    <div className="flex items-center space-x-3 mb-3 transition-all duration-300 group-hover:-translate-y-1">
                                        <p className="text-gray-500 line-through text-lg">{product.originalPrice.toLocaleString('vi-VN')} VNĐ</p>
                                        <motion.p
                                            className="text-red-500 font-bold text-xl"
                                            transition={{ duration: 0.3 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {product.discountedPrice.toLocaleString('vi-VN')} VNĐ
                                        </motion.p>
                                    </div>
                                    <Link
                                        to="/menu"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full font-semibold transition-all duration-300 group-hover:from-red-500 group-hover:to-red-600 group-hover:shadow-lg"
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
                className="py-16 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="w-[96%] mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center font-montserrat">Sản Phẩm Mới</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newProducts.map((product, index) => (
                            <motion.div
                                key={index}
                                className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
                                whileHover={{ scale: 1.03, y: -8 }}
                            >
                                <motion.img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="p-6">
                                    <motion.h3
                                        className="text-xl font-bold text-gray-900 mb-3 transition-all duration-300 group-hover:text-red-600 group-hover:-translate-y-1"
                                    >
                                        {product.name}
                                    </motion.h3>
                                    <div className="flex items-center space-x-3 mb-3 transition-all duration-300 group-hover:-translate-y-1">
                                        <p className="text-gray-500 line-through text-lg">{product.originalPrice.toLocaleString('vi-VN')} VNĐ</p>
                                        <motion.p
                                            className="text-red-500 font-bold text-xl"
                                            transition={{ duration: 0.3 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {product.discountedPrice.toLocaleString('vi-VN')} VNĐ
                                        </motion.p>
                                    </div>
                                    <Link
                                        to="/menu"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full font-semibold transition-all duration-300 group-hover:from-red-500 group-hover:to-red-600 group-hover:shadow-lg"
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
                className="py-16 bg-gray-50 w-full advertisement-fullwidth"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center font-montserrat max-w-5xl mx-auto px-4">Ưu Đãi Đặc Biệt</h2>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {advertisementImages.map((ad, index) => (
                        <motion.img
                            key={index}
                            src={ad.src}
                            alt={ad.alt}
                            className="w-full h-[300px] lg:h-[400px] object-cover"
                            loading="lazy"
                        />
                    ))}
                </div>
            </motion.section>

            {/* Sản phẩm bán chạy */}
            <motion.section
                className="py-16 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="w-[96%] mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center font-montserrat">Sản Phẩm Bán Chạy</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bestSellingProducts.map((product, index) => (
                            <motion.div
                                key={index}
                                className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ease-in-out"
                                whileHover={{ scale: 1.03, y: -8 }}
                            >
                                <motion.img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="p-6">
                                    <motion.h3
                                        className="text-xl font-bold text-gray-900 mb-3 transition-all duration-300 group-hover:text-red-600 group-hover:-translate-y-1"
                                    >
                                        {product.name}
                                    </motion.h3>
                                    <div className="flex items-center space-x-3 mb-3 transition-all duration-300 group-hover:-translate-y-1">
                                        <p className="text-gray-500 line-through text-lg">{product.originalPrice.toLocaleString('vi-VN')} VNĐ</p>
                                        <motion.p
                                            className="text-red-500 font-bold text-xl"
                                            transition={{ duration: 0.3 }}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {product.discountedPrice.toLocaleString('vi-VN')} VNĐ
                                        </motion.p>
                                    </div>
                                    <Link
                                        to="/menu"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full font-semibold transition-all duration-300 group-hover:from-red-500 group-hover:to-red-600 group-hover:shadow-lg"
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