import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { FaTimes, FaEye } from 'react-icons/fa';

// Status Icon Component
const StatusIcon = ({ status }) => {
    switch (status) {
        case 'PENDING':
            return (
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
        case 'CONFIRMED':
            return (
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
        case 'CANCELLED':
            return (
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
        default:
            return (
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
    }
};

// Status Description Component
const StatusDescription = ({ status }) => {
    const getStatusInfo = () => {
        switch (status) {
            case 'PENDING':
                return {
                    title: 'Chờ xác nhận',
                    description: 'Đơn đặt bàn của bạn đang chờ nhà hàng xác nhận',
                    color: 'text-yellow-700',
                    bgColor: 'bg-yellow-50 border-yellow-200'
                };
            case 'CONFIRMED':
                return {
                    title: 'Đã xác nhận',
                    description: 'Đơn đặt bàn đã được xác nhận. Chúng tôi đang chờ đón bạn!',
                    color: 'text-green-700',
                    bgColor: 'bg-green-50 border-green-200'
                };
            case 'CANCELLED':
                return {
                    title: 'Đã hủy',
                    description: 'Đơn đặt bàn đã được hủy',
                    color: 'text-red-700',
                    bgColor: 'bg-red-50 border-red-200'
                };
            default:
                return {
                    title: status,
                    description: 'Trạng thái không xác định',
                    color: 'text-gray-700',
                    bgColor: 'bg-gray-50 border-gray-200'
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className={`flex items-center space-x-4 p-4 rounded-lg border ${statusInfo.bgColor}`}>
            <StatusIcon status={status} />
            <div className="flex-1">
                <h4 className={`font-semibold text-lg ${statusInfo.color}`}>
                    {statusInfo.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                    {statusInfo.description}
                </p>
            </div>
        </div>
    );
};

const BookingDetailModal = ({ booking, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-amber-600">Chi tiết đơn đặt bàn</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Main Content - Single Column Layout */}
                <div className="space-y-6">
                    {/* Customer Information Section */}
                    <div className="bg-gray-50/80 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin khách hàng</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                                <p className="text-lg font-medium text-gray-900">{booking.fullName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                                <p className="text-lg font-medium text-gray-900">{booking.phoneNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Information Section */}
                    <div className="bg-amber-50/80 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin đặt bàn</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Ngày đặt</p>
                                <p className="text-lg font-medium text-amber-600">
                                    {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Giờ đặt</p>
                                <p className="text-lg font-medium text-amber-600">{booking.bookingTime}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Số khách</p>
                                <p className="text-lg font-medium text-gray-900">{booking.numberOfGuests} người</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Khu vực</p>
                                <p className="text-lg font-medium text-gray-900">
                                    {booking.area === 'indoor' ? 'Khu vực chính' :
                                        booking.area === 'vip' ? 'Phòng VIP' :
                                            booking.area === 'outdoor' ? 'Khu vườn' :
                                                booking.area === 'terrace' ? 'Sân thượng' : booking.area}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Special Requests Section */}
                    <div className="bg-blue-50/80 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Yêu cầu đặc biệt</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {booking.specialRequests || 'Không có yêu cầu đặc biệt'}
                        </p>
                    </div>

                    {/* Status and System Information */}
                    <div className="bg-green-50/80 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin hệ thống</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                                <StatusDescription status={booking.status} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Thời gian tạo</p>
                                <p className="text-lg font-medium text-gray-900">
                                    {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-200"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

function BookingHistory() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);

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

    // Handle cancel booking
    const handleCancel = async (id) => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn đặt bàn này?')) return;

        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`http://localhost:8080/api/booking/user/cancel/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setBookings(bookings.map((booking) => (booking.id === id ? response.data : booking)));
            alert('Hủy đơn đặt bàn thành công!');
        } catch (err) {
            alert(err.response?.data.error || 'Lỗi khi hủy đơn đặt bàn.');
        }
    };

    // Handle view booking details
    const handleViewDetails = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:8080/api/booking/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setSelectedBooking(response.data);
        } catch (err) {
            alert(err.response?.data.error || 'Lỗi khi lấy chi tiết đơn đặt bàn.');
        }
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

    // Get status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    // Get area badge styling
    const getAreaBadge = (area) => {
        switch (area) {
            case 'indoor':
                return 'bg-blue-100 text-blue-800';
            case 'vip':
                return 'bg-purple-100 text-purple-800';
            case 'outdoor':
                return 'bg-green-100 text-green-800';
            case 'terrace':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-amber-600 mb-2 font-montserrat">
                        Lịch Sử Đặt Bàn
                    </h1>
                    <div className="h-1 w-24 bg-amber-400 mx-auto rounded-full"></div>
                    <p className="text-gray-600 mt-4 text-lg">Quản lý và theo dõi các đơn đặt bàn của bạn</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6 shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/50 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
                            <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="mb-6">
                                <svg className="mx-auto h-24 w-24 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đơn đặt bàn nào</h3>
                            <p className="text-gray-500 mb-6">Bạn chưa có lịch sử đặt bàn. Hãy tạo đơn đặt bàn đầu tiên của bạn!</p>
                            <Link
                                to="/booking"
                                className="inline-flex items-center px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Đặt bàn ngay
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-200">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thông tin</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thời gian đặt</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Chi tiết</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Khu vực</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Yêu cầu đặc biệt</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {bookings.map((booking, index) => (
                                            <tr key={booking.id} className={`hover:bg-amber-50/50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/30'}`}>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <p className="font-medium text-gray-900">{booking.fullName}</p>
                                                        <p className="text-sm text-gray-500">{booking.phoneNumber}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <p className="font-medium text-gray-900">
                                                            {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                                        </p>
                                                        <p className="text-sm font-medium text-amber-600">{booking.bookingTime}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Đặt lúc: {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-full">
                                                            <span className="text-sm font-semibold text-amber-700">
                                                                {booking.numberOfGuests}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-gray-600">người</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getAreaBadge(booking.area)}`}>
                                                        {formatArea(booking.area)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-gray-600 max-w-xs truncate" title={booking.specialRequests}>
                                                        {booking.specialRequests || 'Không có'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <StatusIcon status={booking.status} />
                                                        <div>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                                                                {formatStatus(booking.status)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewDetails(booking.id)}
                                                            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                                            title="Xem chi tiết"
                                                        >
                                                            <FaEye className="mr-1" />
                                                            Xem
                                                        </button>
                                                        {booking.status === 'PENDING' && (
                                                            <button
                                                                onClick={() => handleCancel(booking.id)}
                                                                className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                                title="Hủy đơn"
                                                            >
                                                                <FaTimes className="mr-1" />
                                                                Hủy
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4 p-4">
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="bg-white/80 rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-lg">{booking.fullName}</h3>
                                                <p className="text-amber-600 font-medium">{booking.phoneNumber}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(booking.id)}
                                                    className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye className="mr-1" />
                                                    Xem
                                                </button>
                                                {booking.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                        title="Hủy đơn"
                                                    >
                                                        <FaTimes className="mr-1" />
                                                        Hủy
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Enhanced Status Section for Mobile */}
                                        <div className="mb-6">
                                            <StatusDescription status={booking.status} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="bg-amber-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 mb-1">Ngày & Giờ</p>
                                                <p className="font-medium text-gray-900">
                                                    {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                                </p>
                                                <p className="text-sm font-medium text-amber-600">{booking.bookingTime}</p>
                                            </div>

                                            <div className="bg-orange-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 mb-1">Chi tiết</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center justify-center w-6 h-6 bg-amber-500 rounded-full">
                                                        <span className="text-xs font-semibold text-white">
                                                            {booking.numberOfGuests}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-600">người</span>
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getAreaBadge(booking.area)}`}>
                                                    {formatArea(booking.area)}
                                                </span>
                                            </div>
                                        </div>

                                        {booking.specialRequests && (
                                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                                <p className="text-xs text-gray-500 mb-1">Yêu cầu đặc biệt</p>
                                                <p className="text-sm text-gray-700">{booking.specialRequests}</p>
                                            </div>
                                        )}

                                        <p className="text-xs text-gray-500 text-right">
                                            Đặt lúc: {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Booking Detail Modal */}
                {selectedBooking && (
                    <BookingDetailModal
                        booking={selectedBooking}
                        onClose={() => setSelectedBooking(null)}
                    />
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                    <Link
                        to="/booking"
                        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto text-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Đặt Bàn Mới
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center px-8 py-3 bg-white/70 backdrop-blur-sm text-gray-700 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200 w-full sm:w-auto text-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Quay Lại Trang Chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BookingHistory;