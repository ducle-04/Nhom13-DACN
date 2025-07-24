import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaCheck, FaTimes, FaTrash, FaEye } from 'react-icons/fa';
import { getAllBookings, confirmBooking, cancelBooking, deleteBooking, getBookingDetails } from '../../../services/api/bookingService';

function AdminBookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBookings = async () => {
            if (!token) {
                setError('Vui lòng đăng nhập với vai trò admin để quản lý đặt bàn.');
                setLoading(false);
                return;
            }

            try {
                const data = await getAllBookings(token);
                setBookings(data);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Không có quyền truy cập hoặc lỗi khi lấy danh sách đặt bàn.');
                setLoading(false);
            }
        };

        fetchBookings();
    }, [token]);

    const handleConfirm = async (id) => {
        try {
            const updatedBooking = await confirmBooking(token, id);
            setBookings(bookings.map((booking) => (booking.id === id ? updatedBooking : booking)));
            alert('Xác nhận đơn đặt bàn thành công!');
        } catch (err) {
            alert(err.message || 'Lỗi khi xác nhận đơn đặt bàn.');
        }
    };

    const handleCancel = async (id) => {
        try {
            const updatedBooking = await cancelBooking(token, id);
            setBookings(bookings.map((booking) => (booking.id === id ? updatedBooking : booking)));
            alert('Hủy đơn đặt bàn thành công!');
        } catch (err) {
            alert(err.message || 'Lỗi khi hủy đơn đặt bàn.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa đơn đặt bàn này?')) return;

        try {
            await deleteBooking(token, id);
            setBookings(bookings.filter((booking) => booking.id !== id));
            alert('Xóa đơn đặt bàn thành công!');
        } catch (err) {
            alert(err.message || 'Lỗi khi xóa đơn đặt bàn.');
        }
    };

    const handleViewDetails = async (id) => {
        try {
            const booking = await getBookingDetails(token, id);
            setSelectedBooking(booking);
            setShowDetailModal(true);
        } catch (err) {
            alert(err.message || 'Lỗi khi xem chi tiết đơn đặt bàn.');
        }
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedBooking(null);
    };

    const formatStatus = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ xác nhận';
            case 'CONFIRMED': return 'Đã xác nhận';
            case 'CANCELLED': return 'Đã hủy';
            default: return status;
        }
    };

    const formatArea = (area) => {
        switch (area) {
            case 'indoor': return 'Khu vực chính';
            case 'vip': return 'Phòng VIP';
            case 'outdoor': return 'Khu vườn';
            case 'terrace': return 'Sân thượng';
            default: return area;
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500 text-lg">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-500 text-lg">{error}</div>;

    return (
        <div className="p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 bg-gray-200">
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
                                <thead className="bg-gray-200">
                                    <tr>
                                        {['#', 'Họ Tên', 'Số Điện Thoại', 'Ngày', 'Giờ', 'Số Khách', 'Khu Vực', 'Yêu Cầu Đặc Biệt', 'Thời Gian Đặt', 'Trạng Thái', 'Thao Tác'].map((header) => (
                                            <th key={header} className="border border-gray-300 p-3 text-left">
                                                {header}
                                            </th>
                                        ))}
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
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : booking.status === 'CONFIRMED'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
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

            {showDetailModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 font-montserrat">Chi Tiết Đơn Đặt Bàn</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: 'ID', value: selectedBooking.id },
                                    { label: 'Họ Tên', value: selectedBooking.fullName },
                                    { label: 'Số Điện Thoại', value: selectedBooking.phoneNumber },
                                    { label: 'Ngày', value: format(new Date(selectedBooking.bookingDate), 'dd/MM/yyyy') },
                                    { label: 'Giờ', value: selectedBooking.bookingTime },
                                    { label: 'Số Khách', value: selectedBooking.numberOfGuests },
                                    { label: 'Khu Vực', value: formatArea(selectedBooking.area) },
                                    { label: 'Yêu Cầu Đặc Biệt', value: selectedBooking.specialRequests || 'Không có' },
                                    { label: 'Thời Gian Đặt', value: format(new Date(selectedBooking.createdAt), 'dd/MM/yyyy HH:mm') },
                                    {
                                        label: 'Trạng Thái',
                                        value: (
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedBooking.status === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : selectedBooking.status === 'CONFIRMED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {formatStatus(selectedBooking.status)}
                                            </span>
                                        )
                                    },
                                    { label: 'Tên Người Dùng', value: selectedBooking.username || 'Không có' },
                                ].map((item, index) => (
                                    <div key={index}>
                                        <label className="block text-sm font-medium text-gray-700">{item.label}:</label>
                                        <p className="mt-1 text-sm text-gray-600">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleCloseDetailModal}
                                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminBookingManagement;