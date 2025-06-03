import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const newsData = [
    {
        id: 1,
        title: 'Ưu Đãi Đặc Biệt Tháng 6 Tại FoodieHub',
        image: '/images/news-promo.jpg',
        summary: 'Khám phá các ưu đãi hấp dẫn với giảm giá lên đến 30% cho tất cả các combo gà rán trong tháng 6 này!',
        date: '01/06/2025',
    },
    {
        id: 2,
        title: 'Ra Mắt Menu Mới: Pizza Hải Sản',
        image: '/images/news-pizza.jpg',
        summary: 'FoodieHub giới thiệu món Pizza Hải Sản mới với topping tươi ngon, chỉ có trong tháng này!',
        date: '03/06/2025',
    },
    {
        id: 3,
        title: 'Sự Kiện Ẩm Thực Tại TP.HCM',
        image: '/images/news-event.jpg',
        summary: 'Tham gia sự kiện ẩm thực lớn nhất năm với các món ăn độc đáo từ FoodieHub vào cuối tuần này.',
        date: '05/06/2025',
    },
];

function News() {
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            <motion.section
                className="py-12 bg-white shadow-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 font-montserrat mb-4">Tin Tức</h1>
                    <p className="text-lg text-gray-600">Cập nhật mới nhất từ FoodieHub</p>
                </div>
            </motion.section>

            <motion.section
                className="py-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsData.map((news) => (
                            <motion.div
                                key={news.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                                whileHover={{ scale: 1.02, y: -5 }}
                            >
                                <motion.img
                                    src={news.image}
                                    alt={news.title}
                                    className="w-full h-48 object-cover"
                                    loading="lazy"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{news.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{news.date}</p>
                                    <p className="text-gray-700 mb-4">{news.summary}</p>
                                    <Link
                                        to={`/news/${news.id}`}
                                        className="inline-block px-4 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors duration-200"
                                    >
                                        Xem chi tiết
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

export default News;