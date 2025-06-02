import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
    // Dữ liệu slider
    const sliderImages = [
        {
            src: 'https://via.placeholder.com/1200x400?text=Phở+Bò',
            title: 'Phở Bò Thơm Ngon',
            description: 'Thưởng thức phở bò truyền thống với nước dùng đậm đà.',
        },
        {
            src: 'https://via.placeholder.com/1200x400?text=Bánh+Mì',
            title: 'Bánh Mì Việt Nam',
            description: 'Bánh mì giòn rụm với nhân thịt nướng và rau tươi.',
        },
        {
            src: 'https://via.placeholder.com/1200x400?text=Cơm+Tấm',
            title: 'Cơm Tấm Sài Gòn',
            description: 'Cơm tấm dẻo thơm với sườn nướng và nước mắm đặc trưng.',
        },
    ];

    // Dữ liệu cho Lựa chọn thực đơn
    const menuCategories = [
        { name: 'Gà rán', img: 'https://via.placeholder.com/150?text=Gà+Rán' },
        { name: 'Mỳ ý', img: 'https://via.placeholder.com/150?text=Mỳ+Ý' },
        { name: 'Pizza', img: 'https://via.placeholder.com/150?text=Pizza' },
        { name: 'Cơm', img: 'https://via.placeholder.com/150?text=Cơm' },
        { name: 'Salad', img: 'https://via.placeholder.com/150?text=Salad' },
        { name: 'Bánh', img: 'https://via.placeholder.com/150?text=Bánh' },
    ];

    // Dữ liệu cho Voucher
    const vouchers = [
        { code: 'GIAM20K', description: 'Giảm 20K cho đơn từ 100K', expiry: 'Hết hạn: 30/06/2025' },
        { code: 'FREESHIP', description: 'Miễn phí giao hàng cho đơn từ 150K', expiry: 'Hết hạn: 30/06/2025' },
    ];

    // Dữ liệu cho Khuyến mãi
    const promotions = [
        { name: 'Combo Gà Rán', price: 120000, img: 'https://via.placeholder.com/150?text=Combo+Gà+Rán', discount: 'Giảm 15%' },
        { name: 'Pizza Hải Sản', price: 150000, img: 'https://via.placeholder.com/150?text=Pizza+Hải+Sản', discount: 'Giảm 20%' },
        { name: 'Mỳ Ý Bò Bằm', price: 80000, img: 'https://via.placeholder.com/150?text=Mỳ+Ý+Bò+Bằm', discount: 'Giảm 10%' },
    ];

    // Dữ liệu cho Sản phẩm nổi bật
    const featuredProducts = [
        { name: 'Phở Gà', price: 55000, img: 'https://via.placeholder.com/150?text=Phở+Gà' },
        { name: 'Pizza Phô Mai', price: 130000, img: 'https://via.placeholder.com/150?text=Pizza+Phô+Mai' },
        { name: 'Salad Cá Hồi', price: 70000, img: 'https://via.placeholder.com/150?text=Salad+Cá+Hồi' },
    ];

    // Dữ liệu cho Sản phẩm bán chạy
    const bestSellingProducts = [
        { name: 'Bánh Mì Trứng', price: 25000, img: 'https://via.placeholder.com/150?text=Bánh+Mì+Trứng' },
        { name: 'Cơm Gà Xối Mỡ', price: 45000, img: 'https://via.placeholder.com/150?text=Cơm+Gà+Xối+Mỡ' },
        { name: 'Gà Rán Phô Mai', price: 65000, img: 'https://via.placeholder.com/150?text=Gà+Rán+Phô+Mai' },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Tự động chuyển slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
        }, 5000); // Chuyển slide mỗi 5 giây
        return () => clearInterval(interval);
    }, [sliderImages.length]);

    // Hàm chuyển slide thủ công
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Hàm chuyển slide trước/sau
    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    };

    // Hiệu ứng animation cho các section
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    return (
        <div className="w-full">
            {/* Slider */}
            <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {sliderImages.map((slide, index) => (
                        <div key={index} className="min-w-full h-[400px] lg:h-[500px] relative">
                            <img
                                src={slide.src}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
                                <div className="text-center text-white px-4">
                                    <h2 className="text-3xl lg:text-5xl font-bold font-montserrat mb-3 lg:mb-4 tracking-tight">{slide.title}</h2>
                                    <p className="text-base lg:text-xl mb-4 lg:mb-6">{slide.description}</p>
                                    <Link
                                        to="/menu"
                                        className="inline-block px-6 py-2 lg:px-8 lg:py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg"
                                    >
                                        Xem thực đơn
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={goToPrevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-200"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                    onClick={goToNextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-200"
                >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {sliderImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white scale-125' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Lựa chọn thực đơn */}
            <motion.section
                className="py-12 bg-gray-100"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center font-montserrat">Lựa Chọn Thực Đơn</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                        {menuCategories.map((category, index) => (
                            <Link
                                key={index}
                                to="/menu"
                                className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-200"
                            >
                                <img
                                    src={category.img}
                                    alt={category.name}
                                    className="w-24 h-24 rounded-full object-cover mb-2"
                                />
                                <p className="text-gray-800 font-semibold">{category.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Voucher */}
            <motion.section
                className="py-12 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center font-montserrat">Ưu Đãi Voucher</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {vouchers.map((voucher, index) => (
                            <div
                                key={index}
                                className="p-6 bg-blue-50 rounded-lg shadow-md flex flex-col items-center text-center"
                            >
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">{voucher.code}</h3>
                                <p className="text-gray-600 mb-2">{voucher.description}</p>
                                <p className="text-sm text-gray-500">{voucher.expiry}</p>
                                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                                    Lấy mã
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Khuyến mãi */}
            <motion.section
                className="py-12 bg-gray-100"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center font-montserrat">Khuyến Mãi Hấp Dẫn</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promotions.map((product, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                            >
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-gray-600">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                                    <p className="text-sm text-red-500 font-semibold">{product.discount}</p>
                                    <Link
                                        to="/menu"
                                        className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Ảnh quảng cáo */}
            <motion.section
                className="py-12 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4">
                    <img
                        src="https://via.placeholder.com/1200x300?text=Quảng+Cáo+Ưu+Đãi"
                        alt="Quảng cáo"
                        className="w-full h-auto rounded-lg shadow-md"
                    />
                </div>
            </motion.section>

            {/* Sản phẩm nổi bật */}
            <motion.section
                className="py-12 bg-gray-100"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center font-montserrat">Sản Phẩm Nổi Bật</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProducts.map((product, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                            >
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-gray-600">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                                    <Link
                                        to="/menu"
                                        className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Sản phẩm bán chạy */}
            <motion.section
                className="py-12 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center font-montserrat">Sản Phẩm Bán Chạy</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bestSellingProducts.map((product, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                            >
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-gray-600">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                                    <Link
                                        to="/menu"
                                        className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </div>
    );
}

export default Home;