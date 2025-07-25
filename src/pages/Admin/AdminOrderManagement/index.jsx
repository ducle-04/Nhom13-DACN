import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaCheck, FaEye, FaTimes } from 'react-icons/fa';
import { getAdminOrders, updateOrderStatus, updatePaymentStatus, cancelOrder } from '../../../services/api/orderService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function AdminOrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setError('Vui lòng đăng nhập với vai trò admin để quản lý đơn hàng.');
                setLoading(false);
                return;
            }

            try {
                const orderData = await getAdminOrders(token);
                setOrders(orderData);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Không thể tải danh sách đơn hàng.');
                toast.error(err.message || 'Không thể tải danh sách đơn hàng.', {
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

        fetchOrders();
    }, [token]);

    const handleUpdateStatus = async (id, status) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận cập nhật trạng thái',
            text: `Bạn có chắc muốn cập nhật trạng thái đơn hàng thành "${formatStatus(status)}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedOrder = await updateOrderStatus(token, id, status);
            setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
            toast.success(`Cập nhật trạng thái đơn hàng thành ${formatStatus(status)} thành công!`, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        } catch (err) {
            toast.error(err.message || 'Không thể cập nhật trạng thái đơn hàng.', {
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

    const handleUpdatePaymentStatus = async (id, status) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận cập nhật thanh toán',
            text: `Bạn có chắc muốn cập nhật trạng thái thanh toán thành "${formatPaymentStatus(status)}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedOrder = await updatePaymentStatus(token, id, status);
            setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
            toast.success(`Cập nhật trạng thái thanh toán thành ${formatPaymentStatus(status)} thành công!`, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        } catch (err) {
            toast.error(err.message || 'Không thể cập nhật trạng thái thanh toán.', {
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
            title: 'Xác nhận hủy đơn hàng',
            text: 'Bạn có chắc muốn hủy đơn hàng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            await cancelOrder(token, id);
            setOrders(orders.filter((order) => order.id !== id));
            toast.success('Hủy đơn hàng thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        } catch (err) {
            toast.error(err.message || 'Không thể hủy đơn hàng.', {
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

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedOrder(null);
    };

    const formatStatus = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ xác nhận';
            case 'CONFIRMED': return 'Đã xác nhận';
            case 'SHIPPING': return 'Đang giao hàng';
            case 'DELIVERED': return 'Đã giao';
            case 'CANCELLED': return 'Đã hủy';
            default: return status || 'Không xác định';
        }
    };

    const formatPaymentStatus = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ thanh toán';
            case 'PAID': return 'Đã thanh toán';
            case 'FAILED': return 'Thanh toán thất bại';
            case 'REFUNDED': return 'Đã hoàn tiền';
            default: return status || 'Không xác định';
        }
    };

    const formatPaymentMethod = (method) => {
        switch (method) {
            case 'CASH': return 'Tiền mặt';
            case 'CARD': return 'Thẻ tín dụng/Thẻ ghi nợ';
            case 'BANK_TRANSFER': return 'Chuyển khoản ngân hàng';
            case 'MOBILE_PAYMENT': return 'Thanh toán qua ứng dụng di động';
            default: return method || 'Không xác định';
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Đang tải...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <ToastContainer />
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-extrabold text-indigo-900 tracking-tight">Quản Lý Đơn Hàng</h2>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-indigo-100 text-indigo-900">
                                <th className="p-4 text-left font-semibold">#</th>
                                <th className="p-4 text-left font-semibold">Họ Tên</th>
                                <th className="p-4 text-left font-semibold">Địa Chỉ Giao</th>
                                <th className="p-4 text-left font-semibold">Ngày Đặt</th>
                                <th className="p-4 text-left font-semibold">Ngày Giao</th>
                                <th className="p-4 text-left font-semibold">Tổng Tiền</th>
                                <th className="p-4 text-left font-semibold">Trạng Thái</th>
                                <th className="p-4 text-left font-semibold">Thanh Toán</th>
                                <th className="p-4 text-left font-semibold">Hình Thức Thanh Toán</th>
                                <th className="p-4 text-left font-semibold">Sửa Trạng Thái</th>
                                <th className="p-4 text-left font-semibold">Sửa Thanh Toán</th>
                                <th className="p-4 text-left font-semibold">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="12" className="text-center text-gray-500 py-6">
                                        Không có đơn hàng nào.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order, index) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-all duration-200">
                                        <td className="p-4 border-t border-gray-200">{index + 1}</td>
                                        <td className="p-4 border-t border-gray-200">{order.fullname}</td>
                                        <td className="p-4 border-t border-gray-200">{order.deliveryAddress}</td>
                                        <td className="p-4 border-t border-gray-200">
                                            {order.orderDate ? format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm') : 'Không xác định'}
                                        </td>
                                        <td className="p-4 border-t border-gray-200">
                                            {order.deliveryDate ? format(new Date(order.deliveryDate), 'dd/MM/yyyy HH:mm') : 'Chưa xác định'}
                                        </td>
                                        <td className="p-4 border-t border-gray-200">
                                            {(order.totalAmount || 0).toLocaleString('vi-VN')} VNĐ
                                        </td>
                                        <td className="p-4 border-t border-gray-200">
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.orderStatus === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                    order.orderStatus === 'SHIPPING' ? 'bg-orange-100 text-orange-800' :
                                                        order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                }`}>
                                                {formatStatus(order.orderStatus)}
                                            </span>
                                        </td>
                                        <td className="p-4 border-t border-gray-200">
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                                    order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {formatPaymentStatus(order.paymentStatus)}
                                            </span>
                                        </td>
                                        <td className="p-4 border-t border-gray-200">
                                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                                                {formatPaymentMethod(order.paymentMethod)}
                                            </span>
                                        </td>
                                        <td className="p-4 border-t border-gray-200">
                                            {order.orderStatus !== 'PENDING' && order.orderStatus !== 'CANCELLED' && (
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="CONFIRMED">Đã xác nhận</option>
                                                    <option value="SHIPPING">Đang giao hàng</option>
                                                    <option value="DELIVERED">Đã giao</option>
                                                    <option value="CANCELLED">Đã hủy</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="p-4 border-t border-gray-200">
                                            {order.orderStatus !== 'CANCELLED' && (
                                                <select
                                                    value={order.paymentStatus}
                                                    onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                                                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    <option value="PENDING">Chờ thanh toán</option>
                                                    <option value="PAID">Đã thanh toán</option>
                                                    <option value="FAILED">Thanh toán thất bại</option>
                                                    <option value="REFUNDED">Đã hoàn tiền</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="p-4 border-t border-gray-200 flex space-x-3">
                                            <button
                                                onClick={() => handleViewDetails(order)}
                                                className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all duration-200"
                                                title="Xem chi tiết"
                                            >
                                                <FaEye />
                                            </button>
                                            {order.orderStatus === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                                                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200"
                                                        title="Xác nhận đơn hàng"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(order.id)}
                                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                                                        title="Hủy đơn hàng"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-full max-w-4xl shadow-2xl backdrop-blur-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Chi Tiết Đơn Hàng</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'ID', value: selectedOrder.id },
                                { label: 'Họ Tên', value: selectedOrder.fullname },
                                { label: 'Email', value: selectedOrder.email },
                                { label: 'Số Điện Thoại', value: selectedOrder.phoneNumber || 'Không có' },
                                { label: 'Địa Chỉ Giao Hàng', value: selectedOrder.deliveryAddress },
                                {
                                    label: 'Ngày Đặt Hàng',
                                    value: selectedOrder.orderDate ? format(new Date(selectedOrder.orderDate), 'dd/MM/yyyy HH:mm') : 'Không xác định'
                                },
                                {
                                    label: 'Ngày Giao Hàng',
                                    value: selectedOrder.deliveryDate ? format(new Date(selectedOrder.deliveryDate), 'dd/MM/yyyy HH:mm') : 'Chưa xác định'
                                },
                                {
                                    label: 'Hình Thức Thanh Toán',
                                    value: (
                                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">
                                            {formatPaymentMethod(selectedOrder.paymentMethod)}
                                        </span>
                                    )
                                },
                                {
                                    label: 'Trạng Thái Thanh Toán',
                                    value: (
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${selectedOrder.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            selectedOrder.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                                selectedOrder.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {formatPaymentStatus(selectedOrder.paymentStatus)}
                                        </span>
                                    )
                                },
                                {
                                    label: 'Trạng Thái Đơn Hàng',
                                    value: (
                                        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${selectedOrder.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            selectedOrder.orderStatus === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                selectedOrder.orderStatus === 'SHIPPING' ? 'bg-orange-100 text-orange-800' :
                                                    selectedOrder.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                            }`}>
                                            {formatStatus(selectedOrder.orderStatus)}
                                        </span>
                                    )
                                },
                                {
                                    label: 'Tổng Tiền',
                                    value: `${(selectedOrder.totalAmount || 0).toLocaleString('vi-VN')} VNĐ`
                                }
                            ].map((item, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-700">{item.label}:</label>
                                    <p className="mt-1 text-sm text-gray-600">{item.value}</p>
                                </div>
                            ))}
                            <div className="lg:col-span-4">
                                <label className="block text-sm font-medium text-gray-700">Mặt Hàng:</label>
                                {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                                        {selectedOrder.orderItems.map((item, index) => (
                                            <li key={item.id || `item-${index}`}>
                                                {item.productName || 'Không xác định'} - Số lượng: {item.quantity || 0} - Giá: {(item.unitPrice || 0).toLocaleString('vi-VN')} VNĐ - Tổng: {(item.subtotal || 0).toLocaleString('vi-VN')} VNĐ
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-1 text-sm text-gray-600">Không có mặt hàng</p>
                                )}
                            </div>
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

export default AdminOrderManagement;