import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    // Animation effect when scrolling to footer
    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector('.footer-container');
            const elements = document.querySelectorAll('.footer-animate-item');

            if (footer) {
                const rect = footer.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight - 100;

                if (isVisible) {
                    footer.classList.add('translate-y-0', 'opacity-100');

                    // Animate each element with a delay
                    elements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('translate-y-0', 'opacity-100');
                        }, 150 * index);
                    });
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        setTimeout(handleScroll, 300);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <footer className="footer-container bg-gray-100 text-gray-800 pt-8 pb-4 mt-8 border-t border-gray-200 transform translate-y-5 opacity-0 transition-all duration-600">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Logo & Contact Info */}
                    <div className="footer-animate-item transform translate-y-5 opacity-0 transition-all duration-500">
                        <Link to="/" className="text-2xl font-bold text-gray-800 font-montserrat">
                            FoodieHub
                        </Link>
                        <p className="mt-2 text-gray-600 italic text-sm">
                            Thưởng thức món ăn ngon, giao hàng tận nơi
                        </p>
                        <div className="mt-3 text-gray-600 text-sm">
                            <div className="flex items-center mb-2">
                                <span className="mr-2">📞</span>
                                <span>0123 456 789</span>
                            </div>
                            <div className="flex items-center mb-2">
                                <span className="mr-2">✉️</span>
                                <span>contact@foodiehub.com</span>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2">📍</span>
                                <span>123 Đường Ẩm Thực, TP.HCM</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-animate-item transform translate-y-5 opacity-0 transition-all duration-500">
                        <h5 className="text-lg font-bold text-gray-800 mb-3 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-10 after:bg-gradient-to-r after:from-blue-600 after:to-green-500 after:rounded">
                            Liên kết nhanh
                        </h5>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/menu" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                                    <span className="mr-2">›</span> Thực đơn
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                                    <span className="mr-2">›</span> Giỏ hàng
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                                    <span className="mr-2">›</span> Về chúng tôi
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                                    <span className="mr-2">›</span> Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-animate-item transform translate-y-5 opacity-0 transition-all duration-500">
                        <h5 className="text-lg font-bold text-gray-800 mb-3 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-10 after:bg-gradient-to-r after:from-blue-600 after:to-green-500 after:rounded">
                            Dịch vụ
                        </h5>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/order" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                                    <span className="mr-2">›</span> Đặt hàng
                                </Link>
                            </li>
                            <li>
                                <Link to="/delivery" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                                    <span className="mr-2">›</span> Giao hàng
                                </Link>
                            </li>
                            <li>
                                <Link to="/promotions" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                                    <span className="mr-2">›</span> Khuyến mãi
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                                    <span className="mr-2">›</span> Hỗ trợ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter & Social */}
                    <div className="footer-animate-item transform translate-y-5 opacity-0 transition-all duration-500">
                        <h5 className="text-lg font-bold text-gray-800 mb-3 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-10 after:bg-gradient-to-r after:from-blue-600 after:to-green-500 after:rounded">
                            Kết nối với chúng tôi
                        </h5>
                        <div className="mb-3">
                            <p className="text-gray-600 text-sm mb-2">Đăng ký nhận ưu đãi mới nhất</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Email của bạn"
                                    aria-label="Email subscription"
                                />
                                <button className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 rounded-r-md hover:from-blue-700 hover:to-green-600 transition-colors">
                                    ✉️
                                </button>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-md"
                            >
                                📘
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:shadow-md"
                            >
                                📸
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-red-600 hover:text-white transition-all duration-300 hover:shadow-md"
                            >
                                ▶️
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 hover:bg-blue-400 hover:text-white transition-all duration-300 hover:shadow-md"
                            >
                                🐦
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200 my-6" />

                <div className="footer-animate-item transform translate-y-5 opacity-0 transition-all duration-500 flex flex-col md:flex-row items-center justify-between text-sm">
                    <p className="mb-2 md:mb-0">© {new Date().getFullYear()} FoodieHub. All rights reserved.</p>
                    <div className="flex space-x-4">
                        <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Chính sách bảo mật
                        </Link>
                        <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                            Điều khoản sử dụng
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;