import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import { Loader2, User, Mail, Phone, MapPin, X, CheckCircle, XCircle, Save } from 'lucide-react';

// Toast Notification Component
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-80 animate-slide-in ${type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
            {type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="font-medium flex-1">{message}</span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [editForm, setEditForm] = useState({
        email: '',
        fullname: '',
        address: '',
        phoneNumber: '',
    });
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const menuRef = useRef(null);

    // Đóng menu khi nhấp ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Lấy thông tin profile khi component mount
    useEffect(() => {
        if (!token) {
            setToast({ message: 'Vui lòng đăng nhập để xem thông tin cá nhân.', type: 'error' });
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    timeout: 5000,
                });
                setUser(response.data);
                setEditForm({
                    email: response.data.email || '',
                    fullname: response.data.fullname || '',
                    address: response.data.address || '',
                    phoneNumber: response.data.phoneNumber || '',
                });
            } catch (error) {
                const status = error.response?.status;
                let errorMsg = 'Lỗi khi tải thông tin người dùng. Vui lòng thử lại.';
                if (status === 401) {
                    errorMsg = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                setToast({ message: errorMsg, type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate, token]);

    // Validate form trước khi submit
    const validateForm = () => {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editForm.email)) {
            errors.push('Email không hợp lệ.');
        }
        if (!editForm.fullname.trim()) {
            errors.push('Họ và tên không được để trống.');
        }
        if (editForm.phoneNumber && !/^\+?\d{8,15}$/.test(editForm.phoneNumber)) {
            errors.push('Số điện thoại không hợp lệ (8-15 chữ số).');
        }
        if (errors.length > 0) {
            setToast({ message: errors.join(' '), type: 'error' });
            return false;
        }
        return true;
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (!user) {
            setToast({ message: 'Không tìm thấy thông tin người dùng.', type: 'error' });
            return;
        }

        if (!window.confirm('Bạn có chắc muốn lưu thay đổi?')) {
            return;
        }

        setUpdateLoading(true);
        try {
            await axios.put(
                'http://localhost:8080/api/user/admin/profile',
                {
                    username: user.username,
                    email: editForm.email,
                    fullname: editForm.fullname,
                    address: editForm.address || '',
                    phoneNumber: editForm.phoneNumber || '',
                },
                {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    timeout: 5000,
                }
            );

            setUser((prev) => ({
                ...prev,
                email: editForm.email,
                fullname: editForm.fullname,
                address: editForm.address,
                phoneNumber: editForm.phoneNumber,
            }));

            setToast({ message: 'Cập nhật thông tin thành công! 🎉', type: 'success' });
            setTimeout(() => {
                setShowModal(false);
                setToast(null);
            }, 1500);
        } catch (error) {
            const status = error.response?.status;
            let errorMsg = error.response?.data?.message || 'Không thể cập nhật thông tin.';
            if (status === 401) {
                errorMsg = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
                localStorage.removeItem('token');
                navigate('/login');
            } else if (status === 403) {
                errorMsg = 'Bạn không có quyền cập nhật thông tin này. Vui lòng kiểm tra vai trò admin.';
            }
            setToast({ message: errorMsg, type: 'error' });
        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <>
            <header
                className="admin-header h-16 sticky top-0 z-50 bg-white border-b shadow-sm flex items-center justify-between px-4"
            >
                <div className="admin-header-left flex items-center gap-2">
                    <img
                        src="/images/logo0.png"
                        alt="FoodieHub Logo"
                        className="h-10 w-10 object-contain"
                    />
                    <span className="text-2xl font-semibold text-indigo-900 tracking-tight">
                        FoodieHub
                    </span>
                </div>

                <div className="admin-header-right flex items-center gap-4">
                    <div className="search-box hidden md:block">
                        <input
                            type="text"
                            className="form-control w-45 bg-gray-100 rounded-full p-2"
                            placeholder="Tìm kiếm..."
                            style={{ minWidth: 180 }}
                        />
                    </div>
                    <div className="relative flex items-center gap-2">
                        <span className="text-gray-500 font-semibold hidden md:inline">
                            Xin chào, {user?.fullname || 'Người dùng'}
                        </span>
                        <FaUserCircle
                            size={32}
                            className="text-primary cursor-pointer"
                            onClick={() => {
                                setShowMenu(!showMenu);
                            }}
                        />
                        {showMenu && (
                            <div
                                ref={menuRef}
                                className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-100 w-48 z-50"
                            >
                                <button
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                                    onClick={() => {
                                        setShowMenu(false);
                                        setShowModal(true);
                                    }}
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Chỉnh sửa thông tin
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center" tabIndex="-1">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 w-full max-w-4xl">
                        <div className="flex justify-between items-center mb-6">
                            <h5 className="text-2xl font-bold text-gray-800">Chỉnh sửa thông tin cá nhân</h5>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {toast && (
                            <Toast
                                message={toast.message}
                                type={toast.type}
                                onClose={() => setToast(null)}
                            />
                        )}

                        {loading ? (
                            <div className="flex justify-center items-center py-4">
                                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        {/* Username - Read Only */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                                Tên đăng nhập
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 p-4 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                                                value={user?.username || ''}
                                                disabled
                                            />
                                        </div>

                                        {/* Full Name */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                                Họ và tên <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                name="fullname"
                                                value={editForm.fullname}
                                                onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                                                placeholder="Nhập họ và tên của bạn"
                                                required
                                                disabled={updateLoading}
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                                Email <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                name="email"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                placeholder="Nhập địa chỉ email"
                                                required
                                                disabled={updateLoading}
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-6">
                                        {/* Phone Number */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="tel"
                                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                name="phoneNumber"
                                                value={editForm.phoneNumber}
                                                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                                placeholder="Nhập số điện thoại"
                                                disabled={updateLoading}
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                                Địa chỉ
                                            </label>
                                            <textarea
                                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                                                name="address"
                                                value={editForm.address}
                                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                placeholder="Nhập địa chỉ của bạn"
                                                rows={5}
                                                disabled={updateLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-2 pt-6 mt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all duration-200"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={updateLoading || !user}
                                    >
                                        {updateLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5 mr-2" />
                                                Lưu thay đổi
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;