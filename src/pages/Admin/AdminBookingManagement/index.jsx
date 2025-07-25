import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaCheck, FaTimes, FaTrash, FaEye } from 'react-icons/fa';
import { getAllBookings, confirmBooking, cancelBooking, deleteBooking, getBookingDetails } from '../../../services/api/bookingService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

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
                toast.error(err.message || 'Không thể tải danh sách đặt bàn.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light',
                });
                setLoading(false);
            }
        };

        fetchBookings();
    }, [token]);

    const handleConfirm = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận đơn đặt bàn',
            text: 'Bạn có chắc muốn xác nhận đơn đặt bàn này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedBooking = await confirmBooking(token, id);
            setBookings(bookings.map((booking) => (booking.id === id ? updatedBooking : booking)));
            toast.success('Xác nhận đơn đặt bàn thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        } catch (err) {
            toast.error(err.message || 'Lỗi khi xác nhận đơn đặt bàn.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        }
    };

    const handleCancel = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận hủy đơn đặt bàn',
            text: 'Bạn có chắc muốn hủy đơn đặt bàn này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Hủy đơn',
            cancelButtonText: 'Thoát',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedBooking = await cancelBooking(token, id);
            setBookings(bookings.map((booking) => (booking.id === id ? updatedBooking : booking)));
            toast.success('Hủy đơn đặt bàn thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        } catch (err) {
            toast.error(err.message || 'Lỗi khi hủy đơn đặt bàn.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        }
    };

    const handleDelete = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận xóa đơn đặt bàn',
            text: 'Bạn có chắc muốn xóa đơn đặt bàn này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            await deleteBooking(token, id);
            setBookings(bookings.filter((booking) => booking.id !== id));
            toast.success('Xóa đơn đặt bàn thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        } catch (err) {
            toast.error(err.message || 'Lỗi khi xóa đơn đặt bàn.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        }
    };

    const handleViewDetails = async (id) => {
        try {
            const booking = await getBookingDetails(token, id);
            setSelectedBooking(booking);
            setShowDetailModal(true);
            toast.success('Tải chi tiết đơn đặt bàn thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        } catch (err) {
            toast.error(err.message || 'Lỗi khi xem chi tiết đơn đặt bàn.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
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
            default: return status || 'Không xác định';
        }
    };

    const formatArea = (area) => {
        switch (area) {
            case 'indoor': return 'Khu vực chính';
            case 'vip': return 'Phòng VIP';
            case 'outdoor': return 'Khu vườn';
            case 'terrace': return 'Sân thượng';
            default: return area || 'Không xác định';
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Đang tải...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <ToastContainer />
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-extrabold text-indigo-900 tracking-tight">Quản Lý Đặt Bàn</h2>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-indigo-100 text-indigo-900">
                                <th className="p-4 text-left font-semibold">#</th>
                                <th className="p-4 text-left font-semibold">Họ Tên</th>
                                <th className="p-4 text-left font-semibold">Số Điện Thoại</th>
                                <th className="p-4 text-left font-semibold">Ngày</th>
                                <th className="p-4 text-left font-semibold">Giờ</th>
                                <th className="p-4 text-left font-semibold">Số Khách</th>
                                <th className="p-4 text-left font-semibold">Khu Vực</th>
                                <th className="p-4 text-left font-semibold">Yêu Cầu Đặc Biệt</th>
                                <th className="p-4 text-left font-semibold">Thời Gian Đặt</th>
                                <th className="p-4 text-left font-semibold">Trạng Thái</th>
                                <th className="p-4 text-left font-semibold">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="text-center text-gray-500 py-6">
                                        Không có đơn đặt bàn nào.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking, index) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-all duration-200">
                                        <td className="p-4 border-t border-gray-200">{index + 1}</td>
                                        <td className="p-4 border-t border-gray-200">{booking.fullName}</td>
                                        <td className="p-4 border-t border-gray-200">{booking.phoneNumber}</td>
                                        <td className="p-4 border-t border-gray-200">
                                            {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="p-4 border-t border-gray-200">{booking.bookingTime}</td>
                                        <td className="p-4 border-t border-gray-200">{booking.numberOfGuests}</td>
                                        <td className="p-4 border-t border-gray-200">{formatArea(booking.area)}</td>
                                        <td className="p-4 border-t border-gray-200">{booking.specialRequests || 'Không có'}</td>
                                        <td className="p-4 border-t border-gray-200">
                                            {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                        </td>
                                        <td className="p-4 border-t border-gray-200">
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {formatStatus(booking.status)}
                                            </span>
                                        </td>
                                        <td className="p-4 border-t border-gray-200 flex space-x-3">
                                            <button
                                                onClick={() => handleViewDetails(booking.id)}
                                                className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all duration-200"
                                                title="Xem chi tiết"
                                            >
                                                <FaEye />
                                            </button>
                                            {booking.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleConfirm(booking.id)}
                                                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200"
                                                        title="Xác nhận đơn đặt bàn"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all duration-200"
                                                        title="Hủy đơn đặt bàn"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(booking.id)}
                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                                                title="Xóa đơn đặt bàn"
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
            </div>

            {showDetailModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-full max-w-4xl shadow-2xl backdrop-blur-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Chi Tiết Đơn Đặt Bàn</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${selectedBooking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            selectedBooking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
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
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleCloseDetailModal}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
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