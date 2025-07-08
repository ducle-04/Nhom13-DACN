import { useEffect, useState } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

function ProductManager() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' | 'edit'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form, setForm] = useState({
        name: '',
        description: '',
        originalPrice: '',
        discountedPrice: '',
        img: '',
        category: '',
        status: 'AVAILABLE',
        specialCategory: '',
    });
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageToShow, setImageToShow] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const baseImagePath = 'http://localhost:5173/images/Product/';

    // Danh sách trạng thái và danh mục đặc biệt hợp lệ
    const VALID_STATUSES = ['AVAILABLE', 'OUT_OF_STOCK', 'DISCONTINUED'];
    const VALID_SPECIAL_CATEGORIES = ['FEATURED', 'NEW', 'BESTSELLER', ''];

    // Lấy danh sách sản phẩm từ backend
    useEffect(() => {
        const fetchProducts = async () => {
            if (!token) {
                setError('Vui lòng đăng nhập với vai trò ADMIN.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/products', {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000,
                });
                const enrichedProducts = response.data.products.map(product => ({
                    id: product.id,
                    name: product.name,
                    description: product.description || '',
                    originalPrice: product.originalPrice,
                    discountedPrice: product.discountedPrice || 0,
                    img: product.img || '/images/Product/placeholder.jpg',
                    discount: calculateDiscount(product.originalPrice, product.discountedPrice || 0),
                    category: product.category,
                    status: product.status || 'AVAILABLE',
                    specialCategory: product.specialCategory || '',
                }));
                setProducts(enrichedProducts);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải danh sách sản phẩm.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [token]);

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
                description: product.description || '',
                originalPrice: product.originalPrice,
                discountedPrice: product.discountedPrice,
                img: product.img && product.img.startsWith(baseImagePath) ? product.img.replace(baseImagePath, '') : product.img,
                category: product.category,
                status: product.status || 'AVAILABLE',
                specialCategory: product.specialCategory || '',
            });
        } else {
            setForm({
                name: '',
                description: '',
                originalPrice: '',
                discountedPrice: '',
                img: '',
                category: '',
                status: 'AVAILABLE',
                specialCategory: '',
            });
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
        setForm((prev) => ({
            ...prev,
            [name]: name === 'originalPrice' || name === 'discountedPrice' ? parseFloat(value) || '' : value,
        }));
    };

    // Mở modal xem ảnh lớn
    const handleShowImage = (img) => {
        setImageToShow(img || '/images/Product/placeholder.jpg');
        setShowImageModal(true);
    };

    // Đóng modal xem ảnh
    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setImageToShow(null);
    };

    // Thêm hoặc chỉnh sửa sản phẩm
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.originalPrice || !form.category || !form.status) {
            setError('Vui lòng nhập đầy đủ thông tin bắt buộc (tên, giá gốc, danh mục, trạng thái).');
            return;
        }
        const originalPrice = parseFloat(form.originalPrice);
        const discountedPrice = parseFloat(form.discountedPrice) || 0;
        if (originalPrice < 0 || discountedPrice < 0) {
            setError('Giá phải là số dương.');
            return;
        }
        if (discountedPrice > originalPrice) {
            setError('Giá khuyến mãi không được lớn hơn giá gốc.');
            return;
        }
        if (!VALID_STATUSES.includes(form.status)) {
            setError(`Trạng thái không hợp lệ. Phải là một trong: ${VALID_STATUSES.join(', ')}`);
            return;
        }
        if (form.specialCategory && !VALID_SPECIAL_CATEGORIES.includes(form.specialCategory)) {
            setError(`Danh mục đặc biệt không hợp lệ. Phải là một trong: ${VALID_SPECIAL_CATEGORIES.filter(c => c).join(', ')} hoặc để trống`);
            return;
        }
        const imageUrl = form.img ? (form.img.startsWith('http') ? form.img : `${baseImagePath}${form.img}`) : null;
        if (imageUrl && imageUrl.startsWith('http') && !isValidUrl(imageUrl)) {
            setError('URL hình ảnh không hợp lệ.');
            return;
        }
        if (imageUrl && !imageUrl.startsWith('http') && !form.img.match(/\.(jpg|jpeg|png|gif)$/i)) {
            setError('Tên tệp hình ảnh phải có đuôi .jpg, .jpeg, .png hoặc .gif.');
            return;
        }

        try {
            if (modalType === 'add') {
                const response = await axios.post('http://localhost:8080/api/products', {
                    name: form.name,
                    description: form.description || null,
                    originalPrice,
                    discountedPrice,
                    discount: ((originalPrice - discountedPrice) / originalPrice * 100).toFixed(2),
                    category: form.category,
                    img: imageUrl,
                    status: form.status,
                    specialCategory: form.specialCategory || null,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000,
                });
                const newProduct = response.data.product;
                setProducts([...products, {
                    id: newProduct.id,
                    name: newProduct.name,
                    description: newProduct.description || '',
                    originalPrice: newProduct.originalPrice,
                    discountedPrice: newProduct.discountedPrice || 0,
                    img: newProduct.img || '/images/Product/placeholder.jpg',
                    discount: calculateDiscount(newProduct.originalPrice, newProduct.discountedPrice || 0),
                    category: newProduct.category,
                    status: newProduct.status || 'AVAILABLE',
                    specialCategory: newProduct.specialCategory || '',
                }]);
            } else if (modalType === 'edit' && selectedProduct) {
                const response = await axios.put(`http://localhost:8080/api/products/${selectedProduct.id}`, {
                    name: form.name,
                    description: form.description || null,
                    originalPrice,
                    discountedPrice,
                    discount: ((originalPrice - discountedPrice) / originalPrice * 100).toFixed(2),
                    category: form.category,
                    img: imageUrl,
                    status: form.status,
                    specialCategory: form.specialCategory || null,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000,
                });
                const updatedProduct = response.data.product;
                setProducts(products.map(p =>
                    p.id === selectedProduct.id ? {
                        ...p,
                        name: updatedProduct.name,
                        description: updatedProduct.description || '',
                        originalPrice: updatedProduct.originalPrice,
                        discountedPrice: updatedProduct.discountedPrice || 0,
                        img: updatedProduct.img || '/images/Product/placeholder.jpg',
                        discount: calculateDiscount(updatedProduct.originalPrice, updatedProduct.discountedPrice || 0),
                        category: updatedProduct.category,
                        status: updatedProduct.status || 'AVAILABLE',
                        specialCategory: updatedProduct.specialCategory || '',
                    } : p
                ));
            }
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || `Không thể ${modalType === 'add' ? 'thêm' : 'cập nhật'} sản phẩm.`);
            console.error(err);
        }
    };

    // Xóa sản phẩm
    const handleDelete = async (id) => {
        if (!token) {
            setError('Vui lòng đăng nhập để thực hiện hành động này.');
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000,
                });
                setProducts(products.filter(p => p.id !== id));
                setError(null);
            } catch (err) {
                setError(err.response?.data || 'Không thể xóa sản phẩm.');
                console.error(err);
            }
        }
    };

    // Kiểm tra URL hợp lệ
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Lọc sản phẩm theo tìm kiếm
    const filtered = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase()) ||
            (p.specialCategory && p.specialCategory.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return <div className="p-6 text-center">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

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
                            placeholder="Tìm tên, danh mục hoặc danh mục đặc biệt..."
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
                            <th className="border border-gray-300 p-3 text-left">Danh mục đặc biệt</th>
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
                                <td colSpan="10" className="text-center text-gray-500 py-4">
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
                                            onError={(e) => { e.target.src = '/images/Product/placeholder.jpg'; }}
                                            onClick={() => handleShowImage(p.img)}
                                        />
                                    </td>
                                    <td className="border border-gray-300 p-3">{p.name}</td>
                                    <td className="border border-gray-300 p-3">{p.category}</td>
                                    <td className="border border-gray-300 p-3">{p.specialCategory || 'Không có'}</td>
                                    <td className="border border-gray-300 p-3">{p.originalPrice.toLocaleString('vi-VN')} VNĐ</td>
                                    <td className="border border-gray-300 p-3">{p.discountedPrice.toLocaleString('vi-VN')} VNĐ</td>
                                    <td className="border border-gray-300 p-3">{p.discount}</td>
                                    <td className="border border-gray-300 p-3">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${p.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                                p.status === 'OUT_OF_STOCK' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-200 text-gray-800'
                                                }`}
                                        >
                                            {p.status === 'AVAILABLE' ? 'Có sẵn' :
                                                p.status === 'OUT_OF_STOCK' ? 'Hết hàng' : 'Ngừng kinh doanh'}
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
                            onError={(e) => { e.target.src = '/images/Product/placeholder.jpg'; }}
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
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                        <h3 className="text-lg font-bold mb-4">{modalType === 'add' ? 'Thêm sản phẩm' : 'Chỉnh sửa sản phẩm'}</h3>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Cột trái */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-medium text-sm">Tên sản phẩm *</label>
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
                                    <div>
                                        <label className="block font-medium text-sm">Giá gốc *</label>
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
                                    <div>
                                        <label className="block font-medium text-sm">Giá khuyến mãi</label>
                                        <input
                                            type="number"
                                            name="discountedPrice"
                                            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.discountedPrice}
                                            onChange={handleChange}
                                            placeholder="Nhập giá khuyến mãi"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium text-sm">Danh mục *</label>
                                        <select
                                            name="category"
                                            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Chọn danh mục</option>
                                            <option value="Gà rán">Gà rán</option>
                                            <option value="Mỳ ý">Mỳ ý</option>
                                            <option value="Pizza">Pizza</option>
                                            <option value="Cơm">Cơm</option>
                                            <option value="Salad">Salad</option>
                                            <option value="Bánh">Bánh</option>
                                            <option value="Đồ uống">Đồ uống</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Cột phải */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-medium text-sm">Trạng thái *</label>
                                        <select
                                            name="status"
                                            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="AVAILABLE">Có sẵn</option>
                                            <option value="OUT_OF_STOCK">Hết hàng</option>
                                            <option value="DISCONTINUED">Ngừng kinh doanh</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-medium text-sm">Danh mục đặc biệt</label>
                                        <select
                                            name="specialCategory"
                                            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.specialCategory}
                                            onChange={handleChange}
                                        >
                                            <option value="">Không có</option>
                                            <option value="FEATURED">Nổi bật</option>
                                            <option value="NEW">Mới</option>
                                            <option value="BESTSELLER">Bán chạy</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-medium text-sm">Hình ảnh</label>
                                        <input
                                            type="text"
                                            name="img"
                                            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={form.img}
                                            onChange={handleChange}
                                            placeholder="Nhập tên tệp hoặc URL"
                                        />
                                        {form.img && (
                                            <img
                                                src={form.img.startsWith('http') ? form.img : `${baseImagePath}${form.img}`}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover mt-2 rounded"
                                                onError={(e) => { e.target.src = '/images/Product/placeholder.jpg'; }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Mô tả chiếm toàn bộ chiều rộng */}
                            <div className="mt-4">
                                <label className="block font-medium text-sm">Mô tả</label>
                                <textarea
                                    name="description"
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Nhập mô tả sản phẩm"
                                    rows="4"
                                />
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

