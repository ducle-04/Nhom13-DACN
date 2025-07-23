import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { FaTimes, FaEye, FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Nhập sweetalert2
import { toast, ToastContainer } from 'react-toastify'; // Nhập react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS của react-toastify

// Status Icon Component
const StatusIcon = ({ status }) => {
    switch (status) {
        case 'PENDING':
            return (
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full shadow-lg border-2 border-amber-200">
                    <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
        case 'CONFIRMED':
            return (
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full shadow-lg border-2 border-emerald-200">
                    <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
        case 'CANCELLED':
            return (
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-100 to-pink-100 rounded-full shadow-lg border-2 border-red-200">
                    <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            );
        default:
            return (
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-slate-100 to-gray-100 rounded-full shadow-lg border-2 border-slate-200">
                    <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                    color: 'text-amber-800',
                    bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/50',
                    icon: <FaClock className="w-5 h-5 text-amber-500" />
                };
            case 'CONFIRMED':
                return {
                    title: 'Đã xác nhận',
                    description: 'Đơn đặt bàn đã được xác nhận. Chúng tôi đang chờ đón bạn!',
                    color: 'text-emerald-800',
                    bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200/50',
                    icon: <FaUtensils className="w-5 h-5 text-emerald-500" />
                };
            case 'CANCELLED':
                return {
                    title: 'Đã hủy',
                    description: 'Đơn đặt bàn đã được hủy',
                    color: 'text-red-800',
                    bgColor: 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200/50',
                    icon: <FaTimes className="w-5 h-5 text-red-500" />
                };
            default:
                return {
                    title: status,
                    description: 'Trạng thái không xác định',
                    color: 'text-slate-800',
                    bgColor: 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200/50',
                    icon: <FaClock className="w-5 h-5 text-slate-500" />
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className={`flex items-center space-x-4 p-6 rounded-2xl border backdrop-blur-sm ${statusInfo.bgColor} shadow-sm hover:shadow-md transition-all duration-300`}>
            <StatusIcon status={status} />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    {statusInfo.icon}
                    <h4 className={`font-bold text-xl ${statusInfo.color}`}>
                        {statusInfo.title}
                    </h4>
                </div>
                <p className="text-slate-600 leading-relaxed">
                    {statusInfo.description}
                </p>
            </div>
        </div>
    );
};

const BookingDetailModal = ({ booking, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-4xl w-full mx-4 p-8 max-h-[90vh] overflow-y-auto border border-white/20">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg">
                            <FaUtensils className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Chi tiết đơn đặt bàn
                            </h2>
                            <p className="text-slate-600 mt-1">Thông tin chi tiết về đơn đặt bàn của bạn</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Customer Information Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <FaUsers className="text-white text-lg" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Thông tin khách hàng</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-sm font-medium text-slate-500 mb-2">Họ và tên</p>
                                <p className="text-xl font-bold text-slate-900">{booking.fullName}</p>
                            </div>
                            <div className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-sm font-medium text-slate-500 mb-2">Số điện thoại</p>
                                <p className="text-xl font-bold text-slate-900">{booking.phoneNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Information Section */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-500 rounded-lg">
                                <FaCalendarAlt className="text-white text-lg" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Thông tin đặt bàn</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-sm font-medium text-slate-500 mb-2">Ngày đặt</p>
                                <p className="text-xl font-bold text-amber-600">
                                    {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                </p>
                            </div>
                            <div className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-sm font-medium text-slate-500 mb-2">Giờ đặt</p>
                                <p className="text-xl font-bold text-amber-600">{booking.bookingTime}</p>
                            </div>
                            <div className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-sm font-medium text-slate-500 mb-2">Số khách</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-10 h-10 bg-amber-500 rounded-full">
                                        <span className="text-white font-bold">{booking.numberOfGuests}</span>
                                    </div>
                                    <span className="text-xl font-bold text-slate-900">người</span>
                                </div>
                            </div>
                            <div className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-sm font-medium text-slate-500 mb-2">Khu vực</p>
                                <p className="text-xl font-bold text-slate-900">
                                    {booking.area === 'indoor' ? 'Khu vực chính' :
                                        booking.area === 'vip' ? 'Phòng VIP' :
                                            booking.area === 'outdoor' ? 'Khu vườn' :
                                                booking.area === 'terrace' ? 'Sân thượng' : booking.area}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Special Requests Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <FaMapMarkerAlt className="text-white text-lg" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Yêu cầu đặc biệt</h3>
                        </div>
                        <div className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                            <p className="text-slate-700 text-lg leading-relaxed">
                                {booking.specialRequests || 'Không có yêu cầu đặc biệt'}
                            </p>
                        </div>
                    </div>

                    {/* Status and System Information */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100/50">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Thông tin hệ thống</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-3">Trạng thái đơn đặt bàn</p>
                                <StatusDescription status={booking.status} />
                            </div>
                            <div className="bg-white/70 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-sm font-medium text-slate-500 mb-2">Thời gian tạo</p>
                                <p className="text-xl font-bold text-slate-900">
                                    {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-semibold rounded-xl hover:from-slate-200 hover:to-slate-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
        // Hiển thị hộp thoại xác nhận
        Swal.fire({
            title: 'Xác nhận hủy đơn',
            text: 'Bạn có chắc chắn muốn hủy đơn đặt bàn này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
                cancelButton: 'px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                try {
                    const response = await axios.put(`http://localhost:8080/api/booking/user/cancel/${id}`, null, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    setBookings(bookings.map((booking) => (booking.id === id ? response.data : booking)));

                    // Hiển thị thông báo thành công
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
                    toast.error(err.response?.data.error || 'Lỗi khi hủy đơn đặt bàn.', {
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
            const response = await axios.get(`http://localhost:8080/api/booking/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setSelectedBooking(response.data);
        } catch (err) {
            toast.error(err.response?.data.error || 'Lỗi khi lấy chi tiết đơn đặt bàn.', {
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
                return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200 shadow-sm';
            case 'CONFIRMED':
                return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200 shadow-sm';
            case 'CANCELLED':
                return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 shadow-sm';
            default:
                return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200 shadow-sm';
        }
    };

    // Get area badge styling
    const getAreaBadge = (area) => {
        switch (area) {
            case 'indoor':
                return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200';
            case 'vip':
                return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200';
            case 'outdoor':
                return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
            case 'terrace':
                return 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200';
            default:
                return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Thêm ToastContainer để hiển thị thông báo */}
            <ToastContainer />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mb-6 shadow-lg">
                        <FaUtensils className="text-white text-2xl" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                        Lịch Sử Đặt Bàn
                    </h1>
                    <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full mb-6"></div>
                    <p className="text-slate-600 text-xl max-w-2xl mx-auto leading-relaxed">
                        Quản lý và theo dõi tất cả các đơn đặt bàn của bạn một cách dễ dàng và hiệu quả
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-6 rounded-2xl mb-8 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-2 bg-red-500 rounded-full">
                                    <FaTimes className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-red-800 text-lg font-semibold">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl border border-white/50 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative mb-8">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200"></div>
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500 absolute top-0 left-0"></div>
                            </div>
                            <p className="text-slate-600 text-xl font-medium">Đang tải lịch sử đặt bàn...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full mb-8 shadow-lg">
                                <FaUtensils className="text-amber-600 text-3xl" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-4">Chưa có đơn đặt bàn nào</h3>
                            <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                                Bạn chưa có lịch sử đặt bàn. Hãy tạo đơn đặt bàn đầu tiên của bạn!
                            </p>
                            <Link
                                to="/booking"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <FaUtensils className="w-5 h-5 mr-3" />
                                Đặt bàn ngay
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View - Enhanced */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border-b border-amber-200">
                                            <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Khách hàng</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Thời gian</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Chi tiết</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Khu vực</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Yêu cầu</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Trạng thái</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {bookings.map((booking, index) => (
                                            <tr key={booking.id} className={`hover:bg-amber-50/50 transition-all duration-300 ${index % 2 === 0 ? 'bg-white/80' : 'bg-slate-50/50'}`}>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                                                                <span className="text-white font-bold text-lg">
                                                                    {booking.fullName.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-lg">{booking.fullName}</p>
                                                            <p className="text-slate-500 font-medium">{booking.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <FaCalendarAlt className="text-amber-500" />
                                                            <p className="font-bold text-slate-900">
                                                                {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FaClock className="text-orange-500" />
                                                            <p className="font-semibold text-amber-600">{booking.bookingTime}</p>
                                                        </div>
                                                        <p className="text-xs text-slate-500">
                                                            Đặt: {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full shadow-md">
                                                            <FaUsers className="text-white text-sm" />
                                                        </div>
                                                        <div>
                                                            <span className="text-xl font-bold text-slate-900">
                                                                {booking.numberOfGuests}
                                                            </span>
                                                            <span className="text-slate-600 ml-1">người</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${getAreaBadge(booking.area)}`}>
                                                        <FaMapMarkerAlt className="mr-2" />
                                                        {formatArea(booking.area)}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="max-w-xs">
                                                        <p className="text-sm text-slate-600 truncate bg-slate-100 px-3 py-2 rounded-lg" title={booking.specialRequests}>
                                                            {booking.specialRequests || 'Không có'}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center space-x-4">
                                                        <StatusIcon status={booking.status} />
                                                        <div>
                                                            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${getStatusBadge(booking.status)}`}>
                                                                {formatStatus(booking.status)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex space-x-3">
                                                        <button
                                                            onClick={() => handleViewDetails(booking.id)}
                                                            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                                                            title="Xem chi tiết"
                                                        >
                                                            <FaEye className="mr-2" />

                                                        </button>
                                                        {booking.status === 'PENDING' && (
                                                            <button
                                                                onClick={() => handleCancel(booking.id)}
                                                                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                                                                title="Hủy đơn"
                                                            >
                                                                <FaTimes className="mr-2" />

                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View - Enhanced */}
                            <div className="lg:hidden space-y-6 p-6">
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                        {/* Card Header */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-white font-bold text-xl">
                                                        {booking.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-xl">{booking.fullName}</h3>
                                                    <p className="text-amber-600 font-semibold text-lg">{booking.phoneNumber}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(booking.id)}
                                                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye className="mr-1" />

                                                </button>
                                                {booking.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                                                        title="Hủy đơn"
                                                    >
                                                        <FaTimes className="mr-1" />

                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Enhanced Status Section for Mobile */}
                                        <div className="mb-6">
                                            <StatusDescription status={booking.status} />
                                        </div>

                                        {/* Booking Details Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FaCalendarAlt className="text-amber-500" />
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ngày & Giờ</p>
                                                </div>
                                                <p className="font-bold text-slate-900 text-lg">
                                                    {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                                </p>
                                                <p className="text-amber-600 font-semibold text-lg">{booking.bookingTime}</p>
                                            </div>

                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FaUsers className="text-blue-500" />
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Chi tiết</p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full shadow-md">
                                                        <span className="text-white font-bold">
                                                            {booking.numberOfGuests}
                                                        </span>
                                                    </div>
                                                    <span className="text-slate-600 font-semibold">người</span>
                                                </div>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold mt-2 ${getAreaBadge(booking.area)}`}>
                                                    <FaMapMarkerAlt className="mr-1" />
                                                    {formatArea(booking.area)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Special Requests */}
                                        {booking.specialRequests && (
                                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border border-purple-100/50">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Yêu cầu đặc biệt</p>
                                                <p className="text-slate-700 leading-relaxed">{booking.specialRequests}</p>
                                            </div>
                                        )}

                                        {/* Created timestamp */}
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full inline-block">
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
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
                    <Link
                        to="/booking"
                        className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-full sm:w-auto text-center text-lg"
                    >
                        <FaUtensils className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        Đặt Bàn Mới
                    </Link>
                    <Link
                        to="/"
                        className="group inline-flex items-center px-10 py-4 bg-white/90 backdrop-blur-sm text-slate-700 font-bold rounded-2xl hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-slate-200 w-full sm:w-auto text-center text-lg"
                    >
                        <svg className="w-6 h-6 mr-3 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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