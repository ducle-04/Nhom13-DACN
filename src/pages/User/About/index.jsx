import { Link } from 'react-router-dom';

function About() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative w-full h-[400px] bg-gray-800">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="text-4xl lg:text-5xl font-bold font-montserrat mb-4 tracking-tight">Giới Thiệu Về FoodieHub</h1>
                        <p className="text-lg lg:text-xl">Mang đến trải nghiệm ẩm thực tiện lợi và chất lượng cho mọi nhà</p>
                    </div>
                </div>
            </section>

            {/* Giới thiệu tổng quan */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center font-montserrat">Chúng Tôi Là Ai?</h2>
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-lg text-gray-600 mb-4">
                            FoodieHub là nền tảng đặt đồ ăn trực tuyến hàng đầu tại Việt Nam, được thành lập vào năm 2020 với mục tiêu mang đến sự tiện lợi và trải nghiệm ẩm thực tuyệt vời cho khách hàng.
                        </p>
                        <p className="text-lg text-gray-600 mb-4">
                            Chúng tôi ra đời từ nhu cầu ngày càng cao về dịch vụ giao đồ ăn nhanh chóng, giúp bạn thưởng thức món ngon từ các nhà hàng yêu thích chỉ với vài cú click. FoodieHub cung cấp dịch vụ đặt món online, giao hàng nhanh trong vòng 30 phút, và hỗ trợ đa dạng các loại hình ẩm thực từ món Việt truyền thống đến món ăn quốc tế.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sứ mệnh và tầm nhìn */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center font-montserrat">Sứ Mệnh & Tầm Nhìn</h2>
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-lg text-gray-600 mb-4">
                            Sứ mệnh của chúng tôi là mang đến trải nghiệm ẩm thực chất lượng và tiện lợi cho mọi người, mọi lúc, mọi nơi. Chúng tôi cam kết kết nối khách hàng với những món ăn ngon nhất, đảm bảo sự hài lòng tuyệt đối.
                        </p>
                        <p className="text-lg text-gray-600 mb-4">
                            Trong tương lai, FoodieHub hướng tới việc trở thành nền tảng đặt đồ ăn số 1 tại Đông Nam Á, mở rộng dịch vụ đến nhiều thành phố hơn và không ngừng cải tiến để phục vụ khách hàng tốt hơn.
                        </p>
                    </div>
                </div>
            </section>

            {/* Giá trị cốt lõi */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center font-montserrat">Giá Trị Cốt Lõi</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Uy Tín</h3>
                            <p className="text-gray-600">Luôn đặt sự hài lòng của khách hàng lên hàng đầu.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tốc Độ</h3>
                            <p className="text-gray-600">Giao hàng nhanh chóng trong 30 phút hoặc ít hơn.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chất Lượng</h3>
                            <p className="text-gray-600">Món ăn luôn tươi ngon, đảm bảo tiêu chuẩn vệ sinh.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Thân Thiện</h3>
                            <p className="text-gray-600">Hỗ trợ khách hàng tận tâm 24/7.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Thành tựu */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center font-montserrat">Thành Tựu Của Chúng Tôi</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="text-center p-6">
                            <h3 className="text-4xl font-bold text-blue-600 mb-2">10.000+</h3>
                            <p className="text-gray-600">Khách hàng tin tưởng và sử dụng dịch vụ.</p>
                        </div>
                        <div className="text-center p-6">
                            <h3 className="text-4xl font-bold text-blue-600 mb-2">150+</h3>
                            <p className="text-gray-600">Đối tác nhà hàng trên toàn quốc.</p>
                        </div>
                        <div className="text-center p-6">
                            <h3 className="text-4xl font-bold text-blue-600 mb-2">5</h3>
                            <p className="text-gray-600">Thành phố lớn đã có mặt.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Thông tin liên hệ */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center font-montserrat">Liên Hệ Với Chúng Tôi</h2>
                    <div className="max-w-2xl mx-auto text-center">
                        <p className="text-lg text-gray-600 mb-2"><strong>Địa chỉ:</strong> 123 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh</p>
                        <p className="text-lg text-gray-600 mb-2"><strong>Hotline:</strong> 1900 1234</p>
                        <p className="text-lg text-gray-600 mb-4"><strong>Email:</strong> support@foodiehub.vn</p>
                        <div className="flex justify-center space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm2.32 15.551h-1.737v-1.738h1.737v1.738zm0-3.475h-1.737v-5.213h1.737v5.213zm-3.475 3.475H9.11v-1.738h1.737v1.738zm0-3.475H9.11v-5.213h1.737v5.213zm-3.475 3.475H5.635v-1.738h1.737v1.738zm0-3.475H5.635v-5.213h1.737v5.213z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;