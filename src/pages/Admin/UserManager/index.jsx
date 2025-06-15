import { useEffect, useState } from 'react';
import { FaUserEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ username: '', email: '', enabled: true });

    const token = localStorage.getItem('token'); // Giả định token được lưu tại đây

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
                    fullName: user.username,
                    email: user.email,
                    status: user.enabled ? 'active' : 'inactive',
                    enabled: user.enabled,
                }));
                setUsers(enrichedUsers);
            } catch (err) {
                setError('Không thể tải danh sách người dùng. Vui lòng kiểm tra token hoặc quyền.');
                console.error(err);
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

        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await axios.delete(`http://localhost:8080/api/user/delete/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(users.filter((user) => user.id !== username));
            } catch (err) {
                setError('Không thể xóa người dùng. Vui lòng kiểm tra quyền.');
                console.error(err);
            }
        }
    };

    // Bắt đầu sửa
    const handleEdit = (user) => {
        setEditingUser(user);
        setEditForm({ username: user.id, email: user.email, enabled: user.status === 'active' });
    };

    // Cập nhật người dùng
    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8080/api/user/update/${editForm.username}`, {
                username: editForm.username,
                email: editForm.email,
                enabled: editForm.enabled,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const updated = users.map(u =>
                u.id === editForm.username
                    ? { ...u, email: editForm.email, status: editForm.enabled ? 'active' : 'inactive' }
                    : u
            );
            setUsers(updated);
            setEditingUser(null);
        } catch (err) {
            setError('Không thể cập nhật người dùng.');
            console.error(err);
        }
    };

    if (loading) return <div className="p-6 text-center">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-montserrat">Quản lý Người dùng</h2>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-3 text-left">UserName</th>
                            <th className="border border-gray-300 p-3 text-left">Họ và Tên</th>
                            <th className="border border-gray-300 p-3 text-left">Email</th>
                            <th className="border border-gray-300 p-3 text-left">Trạng thái</th>
                            <th className="border border-gray-300 p-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-500 py-4">Không có người dùng nào</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="border border-gray-300 p-3">{user.id}</td>
                                    <td className="border border-gray-300 p-3">{user.fullName}</td>
                                    <td className="border border-gray-300 p-3">{user.email}</td>
                                    <td className="border border-gray-300 p-3">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${user.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-200 text-gray-800'
                                                }`}
                                        >
                                            {user.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 p-3 flex space-x-2">
                                        <button
                                            className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                                            onClick={() => handleEdit(user)}
                                        >
                                            <FaUserEdit className="mr-1" /> Chỉnh sửa
                                        </button>
                                        <button
                                            className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                            onClick={() => handleDelete(user.id)}
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

            {/* Modal chỉnh sửa */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Chỉnh sửa người dùng</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full border p-2 rounded"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-medium">Trạng thái</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={editForm.enabled ? 'active' : 'inactive'}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, enabled: e.target.value === 'active' })
                                    }
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Ngừng</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded"
                                onClick={() => setEditingUser(null)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={handleUpdate}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManager;
