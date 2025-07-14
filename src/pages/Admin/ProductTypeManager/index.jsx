import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

function ProductTypeManager() {
    const [productTypes, setProductTypes] = useState([]);
    const [form, setForm] = useState({ name: '' });
    const [modalType, setModalType] = useState('add'); // 'add' | 'edit'
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    // Lấy danh sách loại sản phẩm từ backend
    useEffect(() => {
        const fetchProductTypes = async () => {
            if (!token) {
                setError('Vui lòng đăng nhập với vai trò ADMIN.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/product-types', {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000,
                });
                setProductTypes(response.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data || 'Không thể tải danh sách loại sản phẩm.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProductTypes();
    }, [token]);

    // Xử lý thay đổi form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Mở modal thêm/chỉnh sửa
    const handleOpenModal = (type, productType = null) => {
        setModalType(type);
        setSelectedId(productType?.id || null);
        setForm({ name: productType?.name || '' });
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedId(null);
        setForm({ name: '' });
        setError(null);
    };

    // Thêm hoặc chỉnh sửa loại sản phẩm
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || form.name.trim() === '') {
            setError('Tên loại sản phẩm không được để trống.');
            return;
        }

        try {
            if (modalType === 'add') {
                const response = await axios.post(
                    'http://localhost:8080/api/product-types',
                    { name: form.name },
                    { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 }
                );
                setProductTypes([...productTypes, response.data]);
            } else if (modalType === 'edit' && selectedId) {
                const response = await axios.put(
                    `http://localhost:8080/api/product-types/${selectedId}`,
                    { name: form.name },
                    { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 }
                );
                setProductTypes(productTypes.map(pt => (pt.id === selectedId ? response.data : pt)));
            }
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data || `Không thể ${modalType === 'add' ? 'thêm' : 'cập nhật'} loại sản phẩm.`);
            console.error(err);
        }
    };

    // Xóa loại sản phẩm
    const handleDelete = async (id) => {
        if (!token) {
            setError('Vui lòng đăng nhập để thực hiện hành động này.');
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn xóa loại sản phẩm này?')) {
            try {
                await axios.delete(`http://localhost:8080/api/product-types/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000,
                });
                setProductTypes(productTypes.filter(pt => pt.id !== id));
                setError(null);
            } catch (err) {
                setError(err.response?.data || 'Không thể xóa loại sản phẩm.');
                console.error(err);
            }
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-600 text-lg">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-600 text-lg">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 font-montserrat">Quản lý Loại Sản Phẩm</h2>
                    <button
                        onClick={() => handleOpenModal('add')}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200"
                    >
                        <FaPlus className="mr-2" /> Thêm loại sản phẩm
                    </button>
                </div>
                <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-100">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                                <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">STT</th>
                                <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Tên</th>
                                <th className="border-b border-gray-200 p-4 text-left text-sm font-semibold text-gray-700">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productTypes.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center text-gray-500 py-6">
                                        Không có loại sản phẩm nào
                                    </td>
                                </tr>
                            ) : (
                                productTypes.map((pt, index) => (
                                    <tr key={pt.id} className="hover:bg-gray-50 transition-all duration-200">
                                        <td className="border-b border-gray-200 p-4 text-gray-700">{index + 1}</td>
                                        <td className="border-b border-gray-200 p-4 text-gray-700">{pt.name}</td>
                                        <td className="border-b border-gray-200 p-4 flex space-x-2">
                                            <button
                                                onClick={() => handleOpenModal('edit', pt)}
                                                className="p-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-all duration-200"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pt.id)}
                                                className="p-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-all duration-200"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {modalType === 'add' ? 'Thêm loại sản phẩm' : 'Chỉnh sửa loại sản phẩm'}
                            </h3>
                            {error && <div className="text-red-600 mb-4 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block font-medium text-sm text-gray-700 mb-1">Tên loại sản phẩm *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        required
                                        placeholder="Nhập tên loại sản phẩm"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                                    >
                                        {modalType === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductTypeManager;
