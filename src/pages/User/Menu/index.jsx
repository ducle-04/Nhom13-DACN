import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X } from 'lucide-react';
import { motion } from 'framer-motion';
import menuCategories from '../../../data/menuCategories';
import promotions from '../../../data/promotions';
import featuredProducts from '../../../data/featuredProducts';
import newProducts from '../../../data/newProducts';
import bestSellingProducts from '../../../data/bestSellingProducts';


function Menu() {
    const allProducts = [
        ...promotions,
        ...featuredProducts,
        ...newProducts,
        ...bestSellingProducts,
    ];

    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [selectedPriceRange, setSelectedPriceRange] = useState('Tất cả');
    const [filteredProducts, setFilteredProducts] = useState(allProducts);

    useEffect(() => {
        let result = [...allProducts]; // Tạo bản sao để tránh mutate state gốc

        // Lọc theo loại sản phẩm (dựa trên name)
        if (selectedCategory !== 'Tất cả') {
            result = result.filter(product =>
                product.name.toLowerCase().includes(selectedCategory.toLowerCase())
            );
        }

        // Lọc theo giá
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

        setFilteredProducts(result);
    }, [selectedCategory, selectedPriceRange]);

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
        if (origPrice === discPrice) return 0;
        return Math.round(((origPrice - discPrice) / origPrice) * 100);
    };

    const resetFilters = () => {
        setSelectedCategory('Tất cả');
        setSelectedPriceRange('Tất cả');
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <motion.section
                className="py-12 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 shadow-md "
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                    <span className="text-orange-600 font-medium text-sm tracking-[0.2em] uppercase">
                        Tuyển chọn hấp dẫn
                    </span>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                </div>
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat tracking-tight leading-snug">Thực Đơn</h1>
                    <p className="text-slate-600 text-xl text-center max-w-3xl mb-6 mx-auto leading-relaxed">Khám phá những món ăn tuyệt vời được chế biến với tình yêu và sự tận tâm tại FoodieHub</p>
                </div>
            </motion.section>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
                <motion.section
                    className="w-full lg:w-3/4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    {filteredProducts.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Không có sản phẩm nào phù hợp.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, index) => {
                                const discount = calculateDiscount(product.originalPrice, product.discountedPrice);
                                return (
                                    <motion.div
                                        key={index}
                                        className="group bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                                        whileHover={{ scale: 1.02, y: -5 }}
                                    >
                                        {discount > 0 && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                                -{discount}%
                                            </div>
                                        )}
                                        <div className="w-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto group-hover:w-full transition-all duration-500 rounded-full"></div>
                                        <motion.img
                                            src={product.img}
                                            alt={product.name}
                                            className="w-full h-48 object-cover transition-transform duration-300"
                                            loading="lazy"
                                        />
                                        <div className="p-4 text-center">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 transition-all duration-300 group-hover:text-amber-600 group-hover:-translate-y-1">{product.name}</h3>
                                            <div className="flex justify-center items-center mb-2">
                                                <span className="text-yellow-500">★★★★☆</span>
                                            </div>
                                            <div className="flex justify-center items-baseline space-x-2 mb-2">
                                                <p className="text-gray-500 line-through text-sm ">{parseInt(product.originalPrice).toLocaleString('vi-VN')}đ</p>
                                                <p className="text-red-500 font-bold text-lg">{parseInt(product.discountedPrice).toLocaleString('vi-VN')}đ</p>
                                            </div>
                                            <button
                                                onClick={() => addToCart({ id: index + 1, name: product.name, price: parseInt(product.discountedPrice), quantity: 1, image: product.img })}
                                                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors duration-200"
                                            >
                                                <ShoppingCart className="w-5 h-5 mr-2" />
                                                Đặt ngay
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.section>

                <motion.aside
                    className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-lg h-[500px] overflow-hidden" // Cố định chiều cao 500px, không có thanh cuộn
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Bộ lọc sản phẩm</h2>
                        {(selectedCategory !== 'Tất cả' || selectedPriceRange !== 'Tất cả') && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center text-sm text-red-500 hover:text-red-600 transition-colors duration-200"
                            >
                                <X className="w-4 h-4 mr-1" />
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Loại sản phẩm</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory('Tất cả')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === 'Tất cả'
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Tất cả
                            </button>
                            {menuCategories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedCategory(category.name)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.name
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Khoảng giá</h3>
                        <div className="space-y-2">
                            {priceRanges.map((range, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedPriceRange(range.value)}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${selectedPriceRange === range.value
                                        ? 'bg-orange-100 text-orange-600 font-semibold'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <span>{range.label}</span>
                                    {selectedPriceRange === range.value && (
                                        <span className="text-orange-500">✔</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.aside>
            </div>
        </div>
    );
}

export default Menu;