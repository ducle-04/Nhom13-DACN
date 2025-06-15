import { FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';

function Header() {
    const [showModal, setShowModal] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Quản trị viên',
        email: 'admin@example.com'
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Gửi dữ liệu lên server tại đây
        setShowModal(false);
    };

    return (
        <>
            <header
                className="admin-header bg-white border-b shadow-sm flex items-center justify-between px-4"
                style={{ height: 64, zIndex: 100, position: 'sticky', top: 0 }}
            >
                <div className="admin-header-left flex items-center gap-3">
                    <span className="fw-bold text-2xl text-primary" style={{ letterSpacing: 1 }}>
                        FoodHub <span className="text-gray-800" style={{ fontWeight: 400 }}>Admin</span>
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
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-semibold hidden md:inline">Xin chào, {profile.name}</span>
                        <FaUserCircle
                            size={32}
                            className="text-primary cursor-pointer"
                            onClick={() => setShowModal(true)}
                        />
                    </div>
                </div>
            </header>
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
                    tabIndex="-1"
                >
                    <div className="modal-dialog bg-white rounded-lg w-full max-w-md">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header flex justify-between items-center border-b p-4">
                                <h5 className="text-lg font-bold">Chỉnh sửa thông tin cá nhân</h5>
                                <button
                                    type="button"
                                    className="btn-close text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowModal(false)}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Tên</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-2 border rounded"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer flex justify-end gap-2 p-4 border-t">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;