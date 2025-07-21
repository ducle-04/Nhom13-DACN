import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

function BookingHistory() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch booking history on component mount
    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập để xem lịch sử đặt bàn.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/booking/history', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setBookings(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response) {
                    setError(err.response.data.error || 'Đã có lỗi xảy ra khi lấy lịch sử đặt bàn.');
                } else {
                    setError('Không thể kết nối đến server.');
                }
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-amber-500 text-center mb-6 font-montserrat">
                    Lịch Sử Đặt Bàn - FoodieHub
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center text-gray-600">Đang tải...</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center text-gray-600">
                        Bạn chưa có đơn đặt bàn nào.{' '}
                        <Link to="/booking" className="text-amber-500 hover:underline">
                            Đặt bàn ngay
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-amber-100">
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Họ Tên</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Số Điện Thoại</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ngày</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Giờ</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Số Khách</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Khu Vực</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Yêu Cầu Đặc Biệt</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Thời Gian Đặt</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm text-gray-600">{booking.fullName}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600">{booking.phoneNumber}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600">
                                            {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-600">{booking.bookingTime}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600">{booking.numberOfGuests}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600">{formatArea(booking.area)}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600">
                                            {booking.specialRequests || 'Không có'}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-600">
                                            {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-600">{formatStatus(booking.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex justify-center mt-6 space-x-4">
                    <Link
                        to="/booking"
                        className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-200"
                    >
                        Đặt Bàn Mới
                    </Link>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                        Quay Lại Trang Chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BookingHistory;