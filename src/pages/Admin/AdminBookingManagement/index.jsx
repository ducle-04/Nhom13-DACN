import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { FaCheck, FaTimes, FaTrash, FaEye } from 'react-icons/fa';

function AdminBookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const token = localStorage.getItem('token');

    // Fetch all bookings on component mount
    useEffect(() => {
        const fetchBookings = async () => {
            if (!token) {
                setError('Vui lòng đăng nhập với vai trò admin để quản lý đặt bàn.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/booking/all', {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000,
                });
                setBookings(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data.error || 'Không có quyền truy cập hoặc lỗi khi lấy danh sách đặt bàn.');
                setLoading(false);
            }
        };

        fetchBookings();
    }, [token]);

    // Handle confirm booking
    const handleConfirm = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/booking/confirm/${id}`, null, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
            });
            setBookings(bookings.map((booking) => (booking.id === id ? response.data : booking)));
            alert('Xác nhận đơn đặt bàn thành công!');
        } catch (err) {
            alert(err.response?.data.error || 'Lỗi khi xác nhận đơn đặt bàn.');
        }
    };

    // Handle cancel booking
    const handleCancel = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/booking/cancel/${id}`, null, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
            });
            setBookings(bookings.map((booking) => (booking.id === id ? response.data : booking)));
            alert('Hủy đơn đặt bàn thành công!');
        } catch (err) {
            alert(err.response?.data.error || 'Lỗi khi hủy đơn đặt bàn.');
        }
    };

    // Handle delete booking
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa đơn đặt bàn này?')) return;

        try {
            await axios.delete(`http://localhost:8080/api/booking/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
            });
            setBookings(bookings.filter((booking) => booking.id !== id));
            alert('Xóa đơn đặt bàn thành công!');
        } catch (err) {
            alert(err.response?.data.error || 'Lỗi khi xóa đơn đặt bàn.');
        }
    };

    // Handle view booking details
    const handleViewDetails = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/booking/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
            });
            setSelectedBooking(response.data);
            setShowDetailModal(true);
        } catch (err) {
            alert(err.response?.data.error || 'Lỗi khi xem chi tiết đơn đặt bàn.');
        }
    };

    // Close detail modal
    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedBooking(null);
    };

    // Format status for display
    const formatStatus = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'CONFIRMED':
                return 'Đã xác nhận';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    // Format area for display
    const formatArea = (area) => {
        switch (area) {
            case 'indoor':
                return 'Khu vực chính';
            case 'vip':
                return 'Phòng VIP';
            case 'outdoor':
                return 'Khu vườn';
            case 'terrace':
                return 'Sân thượng';
            default:
                return area;
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-600">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-6">
                    <h2 className="text-2xl font-bold text-gray-800 font-montserrat">Quản Lý Đặt Bàn</h2>
                </div>

                <div className="p-6">
                    {bookings.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                            Không có đơn đặt bàn nào.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">#</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">Họ Tên</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">Số Điện Thoại</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">Ngày</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">Giờ</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">Số Khách</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">Khu Vực</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">Yêu Cầu Đặc Biệt</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">Thời Gian Đặt</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">Trạng Thái</th>
                                        <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking, index) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{index + 1}</td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{booking.fullName}</td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{booking.phoneNumber}</td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{booking.bookingTime}</td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{booking.numberOfGuests}</td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{formatArea(booking.area)}</td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                {booking.specialRequests || 'Không có'}
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${booking.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : booking.status === 'CONFIRMED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {formatStatus(booking.status)}
                                                </span>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetails(booking.id)}
                                                        className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                                    >
                                                        <FaEye className="mr-1" />
                                                    </button>
                                                    {booking.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleConfirm(booking.id)}
                                                                className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                                                            >
                                                                <FaCheck className="mr-1" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancel(booking.id)}
                                                                className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                                                            >
                                                                <FaTimes className="mr-1" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(booking.id)}
                                                        className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                    >
                                                        <FaTrash className="mr-1" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal xem chi tiết đơn đặt bàn */}
            {showDetailModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        <h3 className="text-lg font-bold mb-4 font-montserrat">Chi Tiết Đơn Đặt Bàn</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block font-medium text-sm text-gray-700">ID:</label>
                                <p className="text-sm text-gray-600">{selectedBooking.id}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Họ Tên:</label>
                                <p className="text-sm text-gray-600">{selectedBooking.fullName}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Số Điện Thoại:</label>
                                <p className="text-sm text-gray-600">{selectedBooking.phoneNumber}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Ngày:</label>
                                <p className="text-sm text-gray-600">{format(new Date(selectedBooking.bookingDate), 'dd/MM/yyyy')}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Giờ:</label>
                                <p className="text-sm text-gray-600">{selectedBooking.bookingTime}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Số Khách:</label>
                                <p className="text-sm text-gray-600">{selectedBooking.numberOfGuests}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Khu Vực:</label>
                                <p className="text-sm text-gray-600">{formatArea(selectedBooking.area)}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Yêu Cầu Đặc Biệt:</label>
                                <p className="text-sm text-gray-600">{selectedBooking.specialRequests || 'Không có'}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Thời Gian Đặt:</label>
                                <p className="text-sm text-gray-600">{format(new Date(selectedBooking.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Trạng Thái:</label>
                                <p className="text-sm text-gray-600">{formatStatus(selectedBooking.status)}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-sm text-gray-700">Tên Người Dùng:</label>
                                <p className="text-sm text-gray-600">{selectedBooking.username || 'Không có'}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleCloseDetailModal}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminBookingManagement;