import { useEffect, useState } from 'react';
import { FaEye, FaTrash, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';

function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [addingUser, setAddingUser] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [addForm, setAddForm] = useState({ username: '', email: '', password: '', enabled: true, fullname: '', address: '', phoneNumber: '' });

    const token = localStorage.getItem('token');

    // Lấy danh sách người dùng
    useEffect(() => {
        const fetchUsers = async () => {
            if (!token) {
                setError('Vui lòng đăng nhập với vai trò ADMIN.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/user/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const enrichedUsers = response.data.map(user => ({
                    id: user.username,
                    username: user.username,
                    fullname: user.fullname || '',
                    email: user.email || '',
                    address: user.address || '',
                    phoneNumber: user.phoneNumber || '',
                    status: user.enabled ? 'active' : 'inactive',
                    enabled: user.enabled,
                    roles: user.roles || ['USER'],
                }));
                setUsers(enrichedUsers);
            } catch (err) {
                setError(err.response?.data || 'Không thể tải danh sách người dùng. Vui lòng kiểm tra token hoặc quyền.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    // Xóa người dùng
    const handleDelete = async (username) => {
        if (!token) {
            setError('Vui lòng đăng nhập để thực hiện hành động này.');
            return;
        }

        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${username}?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/user/delete/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(users.filter((user) => user.id !== username));
            } catch (err) {
                setError(err.response?.data || 'Không thể xóa người dùng. Vui lòng kiểm tra quyền.');
            }
        }
    };

    // Xem chi tiết người dùng
    const handleView = (user) => {
        setViewingUser(user);
    };

    // Bắt đầu thêm người dùng
    const handleAddUser = () => {
        setAddingUser(true);
        setAddForm({ username: '', email: '', password: '', enabled: true, fullname: '', address: '', phoneNumber: '' });
    };

    // Kiểm tra định dạng form thêm người dùng
    const validateAddForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!addForm.username.trim()) {
            setError('Tên đăng nhập không được để trống.');
            return false;
        }
        if (!emailRegex.test(addForm.email)) {
            setError('Email không hợp lệ.');
            return false;
        }
        if (!addForm.password.trim()) {
            setError('Mật khẩu không được để trống.');
            return false;
        }
        if (!addForm.fullname.trim()) {
            setError('Họ và tên không được để trống.');
            return false;
        }
        return true;
    };

    // Thêm người dùng
    const handleCreate = async () => {
        if (!validateAddForm()) return;

        setCreateLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/user/create', {
                username: addForm.username,
                email: addForm.email,
                password: addForm.password,
                enabled: addForm.enabled,
                roles: ['USER'],
                fullname: addForm.fullname,
                address: addForm.address || undefined,
                phoneNumber: addForm.phoneNumber || undefined,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const newUser = {
                id: response.data.username,
                username: response.data.username,
                fullname: response.data.fullname || '',
                email: response.data.email || '',
                address: response.data.address || '',
                phoneNumber: response.data.phoneNumber || '',
                status: addForm.enabled ? 'active' : 'inactive',
                enabled: addForm.enabled,
                roles: ['USER'],
            };
            setUsers([...users, newUser]);
            setAddingUser(false);
            setError(null);
        } catch (err) {
            setError(err.response?.data || 'Không thể thêm người dùng.');
        } finally {
            setCreateLoading(false);
        }
    };

    if (loading) return <div className="p-6 text-center">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 font-montserrat">Quản lý Khách Hàng</h2>
                <button
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    onClick={handleAddUser}
                >
                    <FaUserPlus className="mr-2" /> Thêm người dùng
                </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-3 text-left">Tên đăng nhập</th>
                            <th className="border border-gray-300 p-3 text-left">Họ và Tên</th>
                            <th className="border border-gray-300 p-3 text-left">Email</th>
                            <th className="border border-gray-300 p-3 text-left">Địa chỉ</th>
                            <th className="border border-gray-300 p-3 text-left">Số điện thoại</th>
                            <th className="border border-gray-300 p-3 text-left">Trạng thái</th>
                            <th className="border border-gray-300 p-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-500 py-4">Không có người dùng nào</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="border border-gray-300 p-3">{user.username}</td>
                                    <td className="border border-gray-300 p-3">{user.fullname || 'N/A'}</td>
                                    <td className="border border-gray-300 p-3">{user.email || 'N/A'}</td>
                                    <td className="border border-gray-300 p-3">{user.address || 'N/A'}</td>
                                    <td className="border border-gray-300 p-3">{user.phoneNumber || 'N/A'}</td>
                                    <td className="border border-gray-300 p-3">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}
                                        >
                                            {user.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 p-3 flex space-x-2">
                                        <button
                                            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                            onClick={() => handleView(user)}
                                        >
                                            <FaEye className="mr-1" />
                                        </button>
                                        <button
                                            className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            <FaTrash className="mr-1" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal xem chi tiết */}
            {viewingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
                        <h3 className="text-lg font-bold mb-4">Chi tiết người dùng</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium">Tên đăng nhập</label>
                                <p className="w-full border p-2 rounded bg-gray-100">{viewingUser.username}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Họ và Tên</label>
                                <p className="w-full border p-2 rounded bg-gray-100">{viewingUser.fullname || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Email</label>
                                <p className="w-full border p-2 rounded bg-gray-100">{viewingUser.email || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Địa chỉ</label>
                                <p className="w-full border p-2 rounded bg-gray-100">{viewingUser.address || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Số điện thoại</label>
                                <p className="w-full border p-2 rounded bg-gray-100">{viewingUser.phoneNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block font-medium">Trạng thái</label>
                                <p className="w-full border p-2 rounded bg-gray-100">{viewingUser.status === 'active' ? 'Hoạt động' : 'Ngừng'}</p>
                            </div>

                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                                onClick={() => setViewingUser(null)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal thêm người dùng */}
            {addingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Thêm người dùng</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block font-medium">Username</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={addForm.username}
                                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                                    required
                                    disabled={createLoading}
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Họ và Tên</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={addForm.fullname}
                                    onChange={(e) => setAddForm({ ...addForm, fullname: e.target.value })}
                                    required
                                    disabled={createLoading}
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full border p-2 rounded"
                                    value={addForm.email}
                                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                    required
                                    disabled={createLoading}
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="w-full border p-2 rounded"
                                    value={addForm.password}
                                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                    required
                                    disabled={createLoading}
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Địa chỉ</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={addForm.address}
                                    onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                                    disabled={createLoading}
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Số điện thoại</label>
                                <input
                                    type="tel"
                                    className="w-full border p-2 rounded"
                                    value={addForm.phoneNumber}
                                    onChange={(e) => setAddForm({ ...addForm, phoneNumber: e.target.value })}
                                    disabled={createLoading}
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Trạng thái</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={addForm.enabled ? 'active' : 'inactive'}
                                    onChange={(e) => setAddForm({ ...addForm, enabled: e.target.value === 'active' })}
                                    disabled={createLoading}
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Ngừng</option>
                                </select>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                                onClick={() => setAddingUser(false)}
                                disabled={createLoading}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                                onClick={handleCreate}
                                disabled={createLoading}
                            >
                                {createLoading && (
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {createLoading ? 'Đang thêm...' : 'Thêm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManager;
