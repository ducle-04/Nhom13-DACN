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

    if (loading) return <div className="p-6 text-center">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-montserrat">Quản lý Loại Sản Phẩm</h2>
            <button
                onClick={() => handleOpenModal('add')}
                className="mb-4 flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
                <FaPlus className="mr-2" /> Thêm loại sản phẩm
            </button>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-3 text-left">ID</th>
                            <th className="border border-gray-300 p-3 text-left">Tên</th>
                            <th className="border border-gray-300 p-3 text-left">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productTypes.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center text-gray-500 py-4">
                                    Không có loại sản phẩm nào
                                </td>
                            </tr>
                        ) : (
                            productTypes.map(pt => (
                                <tr key={pt.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="border border-gray-300 p-3">{pt.id}</td>
                                    <td className="border border-gray-300 p-3">{pt.name}</td>
                                    <td className="border border-gray-300 p-3 flex space-x-2">
                                        <button
                                            onClick={() => handleOpenModal('edit', pt)}
                                            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                        >
                                            <FaEdit className="mr-1" /> Chỉnh sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pt.id)}
                                            className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
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
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">
                            {modalType === 'add' ? 'Thêm loại sản phẩm' : 'Chỉnh sửa loại sản phẩm'}
                        </h3>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block font-medium text-sm">Tên loại sản phẩm *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    placeholder="Nhập tên loại sản phẩm"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
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

export default ProductTypeManager;