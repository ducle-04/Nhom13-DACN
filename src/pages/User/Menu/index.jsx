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
    // Kết hợp tất cả sản phẩm thành một danh sách duy nhất
    const allProducts = [
        ...promotions,
        ...featuredProducts,
        ...newProducts,
        ...bestSellingProducts,
    ];

    // State cho bộ lọc
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [selectedPriceRange, setSelectedPriceRange] = useState('Tất cả');
    const [filteredProducts, setFilteredProducts] = useState(allProducts);

    // Hàm lọc sản phẩm
    useEffect(() => {
        let result = allProducts;

        // Lọc theo loại sản phẩm
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
                const price = product.discountedPrice;
                return price >= min && price <= max;
            });
        }

        setFilteredProducts(result);
    }, [selectedCategory, selectedPriceRange, allProducts]);

    // Danh sách giá (giá trị để xử lý và hiển thị tách biệt)
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

    // Tính phần trăm giảm giá
    const calculateDiscount = (originalPrice, discountedPrice) => {
        if (originalPrice === discountedPrice) return 0;
        return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    };

    // Reset bộ lọc
    const resetFilters = () => {
        setSelectedCategory('Tất cả');
        setSelectedPriceRange('Tất cả');
    };

    return (
        <div className="w-full min-h-screen bg-gray-50">
            {/* Header của Menu */}
            <motion.section
                className="py-12 bg-white shadow-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 font-montserrat mb-4">Thực Đơn</h1>
                    <p className="text-lg text-gray-600">Khám phá tất cả món ăn ngon tại FoodieHub</p>
                </div>
            </motion.section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
                {/* Danh sách sản phẩm */}
                <motion.section
                    className="w-full lg:w-3/4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
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
                                    <motion.img
                                        src={product.img}
                                        alt={product.name}
                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="p-4 text-center">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                                        <div className="flex justify-center items-center mb-2">
                                            <span className="text-yellow-500">★★★★☆</span>
                                        </div>
                                        <div className="flex justify-center items-baseline space-x-2 mb-2">
                                            <p className="text-gray-500 line-through text-sm">{product.originalPrice.toLocaleString('vi-VN')}đ</p>
                                            <p className="text-red-500 font-bold text-lg">{product.discountedPrice.toLocaleString('vi-VN')}đ</p>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors duration-200"
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            Đặt ngay
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>

                {/* Bộ lọc */}
                <motion.aside
                    className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-lg h-[500px] overflow-y-auto"
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

                    {/* Lọc theo loại sản phẩm */}
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

                    {/* Lọc theo giá */}
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