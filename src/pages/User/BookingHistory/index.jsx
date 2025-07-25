import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaTimes, FaEye, FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBookingHistory, getBookingDetails, cancelBooking } from '../../../services/api/bookingService';

// Status Icon Component
const StatusIcon = ({ status }) => {
    switch (status) {
        case 'PENDING':
            return (
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full shadow-md border border-amber-200">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
        case 'CONFIRMED':
            return (
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full shadow-md border border-emerald-200">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
        case 'CANCELLED':
            return (
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-100 to-rose-100 rounded-full shadow-md border border-red-200">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
        default:
            return (
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-slate-100 to-gray-100 rounded-full shadow-md border border-slate-200">
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    description: 'Đơn đặt bàn của bạn đang chờ nhà hàng xác nhận.',
                    color: 'text-amber-800',
                    bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/50',
                    icon: <FaClock className="w-5 h-5 text-amber-600" />
                };
            case 'CONFIRMED':
                return {
                    title: 'Đã xác nhận',
                    description: 'Đơn đặt bàn đã được xác nhận. Chúng tôi đang chờ đón bạn!',
                    color: 'text-emerald-800',
                    bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200/50',
                    icon: <FaUtensils className="w-5 h-5 text-emerald-600" />
                };
            case 'CANCELLED':
                return {
                    title: 'Đã hủy',
                    description: 'Đơn đặt bàn đã được hủy.',
                    color: 'text-red-800',
                    bgColor: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200/50',
                    icon: <FaTimes className="w-5 h-5 text-red-600" />
                };
            default:
                return {
                    title: status,
                    description: 'Trạng thái không xác định.',
                    color: 'text-slate-800',
                    bgColor: 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200/50',
                    icon: <FaClock className="w-5 h-5 text-slate-600" />
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className={`flex items-center space-x-3 p-4 rounded-xl border backdrop-blur-sm ${statusInfo.bgColor} shadow-sm hover:shadow-md transition-all duration-300`}>
            <StatusIcon status={status} />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    {statusInfo.icon}
                    <h4 className={`font-semibold text-lg ${statusInfo.color}`}>
                        {statusInfo.title}
                    </h4>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                    {statusInfo.description}
                </p>
            </div>
        </div>
    );
};

// Booking Detail Modal Component
const BookingDetailModal = ({ booking, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 pt-20">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-6xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto border border-white/20">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl shadow-md">
                            <FaUtensils className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                Chi tiết đơn đặt bàn
                            </h2>
                            <p className="text-slate-600 text-sm mt-1">Thông tin chi tiết về đơn đặt bàn</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Main Content - Horizontal Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Customer Information Section */}
                        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-5 border border-violet-100/50 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <FaUsers className="text-violet-600 text-lg" />
                                <h3 className="text-lg font-semibold text-slate-800">Thông tin khách hàng</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-white/70 rounded-lg p-3 backdrop-blur-sm">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Họ và tên</p>
                                    <p className="text-lg font-semibold text-slate-900">{booking.fullName}</p>
                                </div>
                                <div className="bg-white/70 rounded-lg p-3 backdrop-blur-sm">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Số điện thoại</p>
                                    <p className="text-lg font-semibold text-slate-900">{booking.phoneNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Information Section */}
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100/50 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <FaCalendarAlt className="text-emerald-600 text-lg" />
                                <h3 className="text-lg font-semibold text-slate-800">Thông tin đặt bàn</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/70 rounded-lg p-3 backdrop-blur-sm">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Ngày đặt</p>
                                    <p className="text-sm font-semibold text-emerald-700">
                                        {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                    </p>
                                </div>
                                <div className="bg-white/70 rounded-lg p-3 backdrop-blur-sm">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Giờ đặt</p>
                                    <p className="text-sm font-semibold text-emerald-700">{booking.bookingTime}</p>
                                </div>
                                <div className="bg-white/70 rounded-lg p-3 backdrop-blur-sm">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Số khách</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center w-6 h-6 bg-emerald-500 rounded-full">
                                            <span className="text-white text-xs font-semibold">{booking.numberOfGuests}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900">người</span>
                                    </div>
                                </div>
                                <div className="bg-white/70 rounded-lg p-3 backdrop-blur-sm">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Khu vực</p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {booking.area === 'indoor' ? 'Khu vực chính' :
                                            booking.area === 'vip' ? 'Phòng VIP' :
                                                booking.area === 'outdoor' ? 'Khu vườn' :
                                                    booking.area === 'terrace' ? 'Sân thượng' : booking.area}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Special Requests Section */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100/50 shadow-sm h-fit">
                            <div className="flex items-center gap-2 mb-4">
                                <FaMapMarkerAlt className="text-purple-600 text-lg" />
                                <h3 className="text-lg font-semibold text-slate-800">Yêu cầu đặc biệt</h3>
                            </div>
                            <div className="bg-white/70 rounded-lg p-4 backdrop-blur-sm min-h-[120px]">
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    {booking.specialRequests || 'Không có yêu cầu đặc biệt'}
                                </p>
                            </div>
                        </div>

                        {/* Status and System Information */}
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100/50 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <FaUtensils className="text-emerald-600 text-lg" />
                                <h3 className="text-lg font-semibold text-slate-800">Thông tin hệ thống</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-medium text-slate-500 mb-2">Trạng thái đơn đặt bàn</p>
                                    <StatusDescription status={booking.status} />
                                </div>
                                <div className="bg-white/70 rounded-lg p-3 backdrop-blur-sm">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Thời gian tạo</p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 font-semibold rounded-xl hover:from-slate-300 hover:to-slate-400 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

function BookingHistory() {
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
                const data = await getBookingHistory(token);
                setBookings(data);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Đã có lỗi xảy ra khi lấy lịch sử đặt bàn.');
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Handle cancel booking
    const handleCancel = async (id) => {
        Swal.fire({
            title: 'Xác nhận hủy đơn',
            text: 'Bạn có chắc chắn muốn hủy đơn đặt bàn này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105',
                cancelButton: 'px-6 py-3 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
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
            }
        });
    };

    // Handle view booking details
    const handleViewDetails = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const bookingDetails = await getBookingDetails(token, id);
            setSelectedBooking(bookingDetails);
        } catch (err) {
            toast.error(err.message || 'Lỗi khi lấy chi tiết đơn đặt bàn.', {
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
                return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200 shadow-sm';
            case 'CONFIRMED':
                return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200 shadow-sm';
            case 'CANCELLED':
                return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200 shadow-sm';
            default:
                return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200 shadow-sm';
        }
    };

    // Get area badge styling
    const getAreaBadge = (area) => {
        switch (area) {
            case 'indoor':
                return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200';
            case 'vip':
                return 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-200';
            case 'outdoor':
                return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200';
            case 'terrace':
                return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200';
            default:
                return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200';
        }
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <ToastContainer />
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-violet-300/30 to-blue-300/30 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl mb-4 shadow-lg">
                        <FaUtensils className="text-white text-2xl" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent mb-2">
                        Lịch Sử Đặt Bàn
                    </h1>
                    <p className="text-lg text-slate-700 font-medium max-w-xl mx-auto">
                        Theo dõi và quản lý các đơn đặt bàn của bạn tại FoodieHub Restaurant
                    </p>
                    <div className="mt-4 w-24 h-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full mx-auto"></div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-4 bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200 rounded-xl flex items-center space-x-3 shadow-md animate-pulse">
                        <FaTimes className="w-5 h-5 text-red-600" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Content Area */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="relative mb-6">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200"></div>
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-violet-600 absolute top-0 left-0"></div>
                            </div>
                            <p className="text-slate-600 text-lg font-medium">Đang tải lịch sử đặt bàn...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl mb-4 shadow-lg">
                                <FaUtensils className="text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-semibold text-slate-800 mb-3">Chưa có đơn đặt bàn</h3>
                            <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
                                Bạn chưa có lịch sử đặt bàn. Hãy bắt đầu bằng cách đặt bàn ngay hôm nay!
                            </p>
                            <Link
                                to="/booking"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                            >
                                <FaUtensils className="w-5 h-5 mr-2" />
                                Đặt bàn ngay
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-violet-100 to-indigo-100 border-b border-violet-200/50">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Khách hàng</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Thời gian</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Số khách</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Khu vực</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Yêu cầu</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {bookings.map((booking, index) => (
                                            <tr key={booking.id} className={`hover:bg-violet-50/50 transition-all duration-300 ${index % 2 === 0 ? 'bg-white/80' : 'bg-slate-50/50'}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                                                            <span className="text-white font-semibold text-sm">
                                                                {booking.fullName.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 text-sm">{booking.fullName}</p>
                                                            <p className="text-slate-600 text-xs">{booking.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <FaCalendarAlt className="text-violet-600 w-4 h-4" />
                                                            <p className="font-semibold text-slate-900 text-sm">
                                                                {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FaClock className="text-violet-600 w-4 h-4" />
                                                            <p className="font-semibold text-violet-700 text-sm">{booking.bookingTime}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full shadow-md">
                                                            <FaUsers className="text-white text-sm" />
                                                        </div>
                                                        <span className="font-semibold text-slate-900 text-sm">{booking.numberOfGuests} người</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${getAreaBadge(booking.area)}`}>
                                                        <FaMapMarkerAlt className="mr-1 w-4 h-4" />
                                                        {formatArea(booking.area)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-xs text-slate-600 truncate bg-slate-100 px-2 py-1 rounded-lg max-w-xs" title={booking.specialRequests}>
                                                        {booking.specialRequests || 'Không có'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${getStatusBadge(booking.status)}`}>
                                                        {formatStatus(booking.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewDetails(booking.id)}
                                                            className="p-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                                            title="Xem chi tiết"
                                                        >
                                                            <FaEye className="w-4 h-4" />
                                                        </button>
                                                        {booking.status === 'PENDING' && (
                                                            <button
                                                                onClick={() => handleCancel(booking.id)}
                                                                className="p-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                                                title="Hủy đơn"
                                                            >
                                                                <FaTimes className="w-4 h-4" />
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
                                    <div key={booking.id} className="group bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-white/50 p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                                        {/* Card Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-white font-semibold text-sm">
                                                        {booking.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 text-sm">{booking.fullName}</h3>
                                                    <p className="text-violet-600 text-xs font-medium">{booking.phoneNumber}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(booking.id)}
                                                    className="p-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg hover:from-violet-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                {booking.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="p-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                                                        title="Hủy đơn"
                                                    >
                                                        <FaTimes className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Section */}
                                        <div className="mb-4">
                                            <StatusDescription status={booking.status} />
                                        </div>

                                        {/* Booking Details Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-100/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaCalendarAlt className="text-emerald-600 w-4 h-4" />
                                                    <p className="text-xs font-medium text-slate-500 uppercase">Ngày & Giờ</p>
                                                </div>
                                                <p className="font-semibold text-slate-900 text-sm">
                                                    {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                                </p>
                                                <p className="text-emerald-700 text-sm font-medium">{booking.bookingTime}</p>
                                            </div>
                                            <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg p-3 border border-violet-100/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaUsers className="text-violet-600 w-4 h-4" />
                                                    <p className="text-xs font-medium text-slate-500 uppercase">Chi tiết</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full shadow-md">
                                                        <span className="text-white font-semibold text-sm">{booking.numberOfGuests}</span>
                                                    </div>
                                                    <span className="text-slate-900 text-sm font-medium">người</span>
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium mt-2 ${getAreaBadge(booking.area)}`}>
                                                    <FaMapMarkerAlt className="mr-1 w-3 h-3" />
                                                    {formatArea(booking.area)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Special Requests */}
                                        {booking.specialRequests && (
                                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 mt-3 border border-purple-100/50">
                                                <p className="text-xs font-medium text-slate-500 uppercase mb-1">Yêu cầu đặc biệt</p>
                                                <p className="text-slate-700 text-xs leading-relaxed">{booking.specialRequests}</p>
                                            </div>
                                        )}

                                        {/* Created timestamp */}
                                        <div className="text-right mt-3">
                                            <p className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full inline-block">
                                                Đặt lúc: {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                            </p>
                                        </div>
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
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Link
                        to="/booking"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                    >
                        <FaUtensils className="w-5 h-5 mr-2" />
                        Đặt Bàn Mới
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 font-semibold rounded-xl hover:from-slate-300 hover:to-slate-400 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
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