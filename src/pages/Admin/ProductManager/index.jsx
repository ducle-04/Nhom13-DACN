import { useState } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const mockProducts = [
    {
        id: 1,
        name: 'Combo Gà Rán',
        originalPrice: 140000,
        discountedPrice: 120000,
        img: '/images/Product/garan-2.jpg',
        discount: 'Giảm 15%',
        category: 'Món chính',
        status: 'active',
    },
    {
        id: 2,
        name: 'Pizza Hải Sản',
        originalPrice: 187500,
        discountedPrice: 150000,
        img: '/images/Product/pizza-hai-san.jpg',
        discount: 'Giảm 20%',
        category: 'Món chính',
        status: 'active',
    },
    {
        id: 3,
        name: 'Mỳ Ý Bò Bằm',
        originalPrice: 88000,
        discountedPrice: 80000,
        img: '/images/Product/my-y-bo-bam.jpg',
        discount: 'Giảm 10%',
        category: 'Món chính',
        status: 'inactive',
    },
];

function ProductManager() {
    const [products, setProducts] = useState(mockProducts);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' | 'edit'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form, setForm] = useState({ name: '', originalPrice: '', discountedPrice: '', img: '', category: '', status: 'active' });
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageToShow, setImageToShow] = useState(null);
    const [error, setError] = useState(null);

    // Tính toán discount
    const calculateDiscount = (originalPrice, discountedPrice) => {
        if (!originalPrice || !discountedPrice || originalPrice <= 0) return 'Giảm 0%';
        const discountPercent = ((originalPrice - discountedPrice) / originalPrice * 100).toFixed(0);
        return `Giảm ${discountPercent}%`;
    };

    // Mở modal thêm/chỉnh sửa
    const handleOpenModal = (type, product = null) => {
        setModalType(type);
        setSelectedProduct(product);
        if (type === 'edit' && product) {
            setForm({
                name: product.name,
                discountedPrice: product.discountedPrice,
                img: product.img,
                category: product.category,
                status: product.status,
            });
        } else {
            setForm({ name: '', originalPrice: '', discountedPrice: '', img: '', category: '', status: 'active' });
        }
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
        setError(null);
    };

    // Xử lý thay đổi form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Mở modal xem ảnh lớn
    const handleShowImage = (img) => {
        setImageToShow(img);
        setShowImageModal(true);
    };

    // Đóng modal xem ảnh
    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setImageToShow(null);
    };

    // Thêm hoặc chỉnh sửa sản phẩm
    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalType === 'add') {
            if (!form.name || !form.originalPrice || !form.discountedPrice || !form.img || !form.category) {
                setError('Vui lòng nhập đầy đủ thông tin.');
                return;
            }
            const originalPrice = parseFloat(form.originalPrice);
            const discountedPrice = parseFloat(form.discountedPrice);
            if (originalPrice < 0 || discountedPrice < 0) {
                setError('Giá phải là số dương.');
                return;
            }
            if (discountedPrice > originalPrice) {
                setError('Giá khuyến mãi không được lớn hơn giá gốc.');
                return;
            }

            const newProduct = {
                id: Date.now(),
                name: form.name,
                originalPrice,
                discountedPrice,
                img: form.img,
                discount: calculateDiscount(originalPrice, discountedPrice),
                category: form.category,
                status: form.status,
            };
            setProducts([...products, newProduct]);
            handleCloseModal();
        } else if (modalType === 'edit' && selectedProduct) {
            if (!form.name || !form.discountedPrice || !form.img || !form.category) {
                setError('Vui lòng nhập đầy đủ thông tin.');
                return;
            }
            const discountedPrice = parseFloat(form.discountedPrice);
            if (discountedPrice < 0) {
                setError('Giá khuyến mãi phải là số dương.');
                return;
            }
            if (discountedPrice > selectedProduct.originalPrice) {
                setError('Giá khuyến mãi không được lớn hơn giá gốc.');
                return;
            }

            setProducts(
                products.map((p) =>
                    p.id === selectedProduct.id
                        ? {
                            ...p,
                            name: form.name,
                            discountedPrice,
                            img: form.img,
                            discount: calculateDiscount(p.originalPrice, discountedPrice),
                            category: form.category,
                            status: form.status,
                        }
                        : p
                )
            );
            handleCloseModal();
        }
    };

    // Xóa sản phẩm
    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            setProducts(products.filter((p) => p.id !== id));
        }
    };

    // Lọc sản phẩm theo tìm kiếm
    const filtered = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 font-montserrat">Quản lý Sản phẩm</h2>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tìm tên hoặc danh mục..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                        onClick={() => handleOpenModal('add')}
                    >
                        <FaPlus className="mr-2" /> Thêm sản phẩm
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-3 text-left">#</th>
                            <th className="border border-gray-300 p-3 text-left">Hình ảnh</th>
                            <th className="border border-gray-300 p-3 text-left">Tên sản phẩm</th>
                            <th className="border border-gray-300 p-3 text-left">Danh mục</th>
                            <th className="border border-gray-300 p-3 text-left">Giá gốc</th>
                            <th className="border border-gray-300 p-3 text-left">Giá khuyến mãi</th>
                            <th className="border border-gray-300 p-3 text-left">Giảm giá</th>
                            <th className="border border-gray-300 p-3 text-left">Trạng thái</th>
                            <th className="border border-gray-300 p-3 text-left">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center text-gray-500 py-4">
                                    Không có sản phẩm phù hợp
                                </td>
                            </tr>
                        ) : (
                            filtered.map((p, idx) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="border border-gray-300 p-3">{idx + 1}</td>
                                    <td className="border border-gray-300 p-3">
                                        <img
                                            src={p.img}
                                            alt={p.name}
                                            className="w-12 h-12 object-cover rounded cursor-pointer"
                                            onClick={() => handleShowImage(p.img)}
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-3">{p.name}</td>
                                    <td className="border border-gray-300 p-3">{p.category}</td>
                                    <td className="border border-gray-300 p-3">{p.originalPrice.toLocaleString('vi-VN')} VNĐ</td>
                                    <td className="border border-gray-300 p-3">{p.discountedPrice.toLocaleString('vi-VN')} VNĐ</td>
                                    <td className="border border-gray-300 p-3">{p.discount}</td>
                                    <td className="border border-gray-300 p-3">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                                                }`}
                                        >
                                            {p.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 p-3 flex space-x-2">
                                        <button
                                            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                            onClick={() => handleOpenModal('edit', p)}
                                        >
                                            <FaEdit className="mr-1" /> Chỉnh sửa
                                        </button>
                                        <button
                                            className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                            onClick={() => handleDelete(p.id)}
                                        >
                                            <FaTrash className="mr-1" /> Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal xem ảnh lớn */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl w-full">
                        <img
                            src={imageToShow}
                            alt="Product"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                        />
                        <button
                            className="absolute top-4 right-4 text-white text-2xl font-bold bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700"
                            onClick={handleCloseImageModal}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Modal thêm/chỉnh sửa */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">{modalType === 'add' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}</h3>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-medium">Tên sản phẩm</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập tên sản phẩm"
                                    />
                                </div>
                                {modalType === 'add' && (
                                    <div>
                                        <label className="block font-medium">Giá gốc</label>
                                        <input
                                            type="number"
                                            name="originalPrice"
                                            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.originalPrice}
                                            onChange={handleChange}
                                            required
                                            placeholder="Nhập giá gốc"
                                            min="0"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block font-medium">Giá khuyến mãi</label>
                                    <input
                                        type="number"
                                        name="discountedPrice"
                                        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={form.discountedPrice}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập giá khuyến mãi"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">URL hình ảnh</label>
                                    <input
                                        type="url"
                                        name="img"
                                        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={form.img}
                                        onChange={handleChange}
                                        required
                                        placeholder="Dán link ảnh"
                                    />
                                    {form.img && (
                                        <img
                                            src={form.img}
                                            alt="Preview"
                                            className="w-20 h-20 object-cover mt-2 rounded"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label className="block font-medium">Danh mục</label>
                                    <select
                                        name="category"
                                        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={form.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        <option value="Món chính">Món chính</option>
                                        <option value="Tráng miệng">Tráng miệng</option>
                                        <option value="Đồ uống">Đồ uống</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-medium">Trạng thái</label>
                                    <select
                                        name="status"
                                        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={form.status}
                                        onChange={handleChange}
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="inactive">Ngừng</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6 space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                    onClick={handleCloseModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {modalType === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductManager;