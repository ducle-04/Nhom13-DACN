import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import banner1Img from '../../../assets/images/product/garan-1.jpg';
import banner2Img from '../../../assets/images/product/banner-2.jpg';
import banner3Img from '../../../assets/images/product/banner-3.jpg';
import MenuCategories from '../../../components/Layout/DefautLayout/UserLayout/Home/MenuCategories';
import Promotions from '../../../components/Layout/DefautLayout/UserLayout/Home/Promotions';
import FeaturedProducts from '../../../components/Layout/DefautLayout/UserLayout/Home/FeaturedProducts';
import NewProducts from '../../../components/Layout/DefautLayout/UserLayout/Home/NewProducts';
import BestSellingProducts from '../../../components/Layout/DefautLayout/UserLayout/Home/BestSellingProducts';
import Testimonials from '../../../components/Layout/DefautLayout/UserLayout/Home/Testimonials';


function Home() {
    const sliderImages = [
        { src: banner1Img },
        { src: banner2Img },
        { src: banner3Img },
    ];

    const vouchers = [
        { code: 'GIAM20K', description: 'Giảm 20K cho đơn từ 100K', expiry: 'Hết hạn: 30/06/2025' },
        { code: 'FREESHIP', description: 'Miễn phí giao hàng cho đơn từ 150K', expiry: 'Hết hạn: 30/06/2025' },
        { code: 'GIAM50K', description: 'Giảm 50K cho đơn từ 200K', expiry: 'Hết hạn: 20/06/2025' },
    ];

    const advertisementImages = [
        { src: '/images/Product/quangcao-1.jpg', alt: 'Quảng Cáo 1' },
        { src: '/images/Product/quangcao-2.jpg', alt: 'Quảng Cáo 2' },
    ];

    const additionalAdvertisement = {
        src: '/images/Product/quangcao.jpg',
        alt: 'Quảng Cáo Khuyến Mãi',
    };

    const [currentSlide, setCurrentSlide] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [sliderImages.length]);

    useEffect(() => {
        if (location.pathname === '/promotions') {
            const promotionsSection = document.getElementById('promotions');
            if (promotionsSection) {
                promotionsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.pathname]);

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

                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    {sliderImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-amber-400 scale-125' : 'bg-white/60 hover:bg-white/90'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Lựa chọn thực đơn */}
            <MenuCategories />

            {/* Voucher Section */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <div className="w-[90%] mx-auto px-4 relative z-10">
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
                                <div className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-pink-400/20 to-purple-400/20 rounded-3xl blur-sm group-hover:blur-none transition-all duration-500"></div>
                                    <div className="relative z-10">
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
                                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 mb-4 tracking-wide">
                                            {voucher.code}
                                        </h3>
                                        <p className="text-slate-600 mb-4 text-lg leading-relaxed">
                                            {voucher.description}
                                        </p>
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                                            <span className="text-slate-500 text-sm">
                                                {voucher.expiry}
                                            </span>
                                        </div>
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
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-all duration-300 rounded-2xl blur-sm"></div>
                                        </motion.button>
                                    </div>
                                </div>
                                <motion.div
                                    className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-60"
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                                        scale: { duration: 2, repeat: Infinity },
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>

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
            <Promotions />

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
            <FeaturedProducts />

            {/* Sản phẩm mới */}
            <NewProducts />

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
            <BestSellingProducts />

            {/* Ý kiến khách hàng */}
            <Testimonials />
        </div>
    );
}

export default Home;