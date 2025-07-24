import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaCheck, FaEye, FaTimes } from 'react-icons/fa';
import { getAdminOrders, updateOrderStatus, updatePaymentStatus, cancelOrder } from '../../../services/api/orderService';

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
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    const handleUpdateStatus = async (id, status) => {
        try {
            const updatedOrder = await updateOrderStatus(token, id, status);
            setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
            alert(`Cập nhật trạng thái đơn hàng thành ${formatStatus(status)} thành công!`);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdatePaymentStatus = async (id, status) => {
        try {
            const updatedOrder = await updatePaymentStatus(token, id, status);
            setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
            alert(`Cập nhật trạng thái thanh toán thành ${formatPaymentStatus(status)} thành công!`);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

        try {
            await cancelOrder(token, id);
            setOrders(orders.filter((order) => order.id !== id));
            alert('Hủy đơn hàng thành công!');
        } catch (err) {
            alert(err.message);
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

    if (loading) return <div className="p-6 text-center text-gray-500 text-lg">Đang tải...</div>;
    if (error) return <div className="p-6 text-center text-red-500 text-lg">{error}</div>;

    return (
        <div className="p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 bg-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 font-montserrat">Quản Lý Đơn Hàng</h2>
                </div>

                <div className="p-6">
                    {orders.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                            Không có đơn hàng nào.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead className="bg-gray-200">
                                    <tr>
                                        {['#', 'Họ Tên', 'Số Điện Thoại', 'Địa Chỉ Giao', 'Ngày Đặt', 'Ngày Giao', 'Tổng Tiền', 'Trạng Thái', 'Thanh Toán', 'Hình Thức Thanh Toán', 'Sửa Trạng Thái', 'Sửa Thanh Toán', 'Thao Tác'].map((header) => (
                                            <th key={header} className="border border-gray-300 p-3 text-left">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{index + 1}</td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{order.fullname}</td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{order.phoneNumber || 'Không có'}</td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">{order.deliveryAddress}</td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                {order.orderDate ? format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm') : 'Không xác định'}
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                {order.deliveryDate ? format(new Date(order.deliveryDate), 'dd/MM/yyyy HH:mm') : 'Chưa xác định'}
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                {(order.totalAmount || 0).toLocaleString('vi-VN')} VNĐ
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : order.orderStatus === 'CONFIRMED'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : order.orderStatus === 'SHIPPING'
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : order.orderStatus === 'DELIVERED'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {formatStatus(order.orderStatus)}
                                                </span>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : order.paymentStatus === 'PAID'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.paymentStatus === 'FAILED'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {formatPaymentStatus(order.paymentStatus)}
                                                </span>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {formatPaymentMethod(order.paymentMethod)}
                                                </span>
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                {order.orderStatus !== 'PENDING' && order.orderStatus !== 'CANCELLED' && (
                                                    <select
                                                        value={order.orderStatus}
                                                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                        className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                                                    >
                                                        <option value="CONFIRMED">Đã xác nhận</option>
                                                        <option value="SHIPPING">Đang giao hàng</option>
                                                        <option value="DELIVERED">Đã giao</option>
                                                        <option value="CANCELLED">Đã hủy</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                {order.orderStatus !== 'CANCELLED' && (
                                                    <select
                                                        value={order.paymentStatus}
                                                        onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                                                        className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                                                    >
                                                        <option value="PENDING">Chờ thanh toán</option>
                                                        <option value="PAID">Đã thanh toán</option>
                                                        <option value="FAILED">Thanh toán thất bại</option>
                                                        <option value="REFUNDED">Đã hoàn tiền</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 p-3 text-sm text-gray-600">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetails(order)}
                                                        className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                                        title="Xem chi tiết"
                                                    >
                                                        <FaEye className="mr-1" />
                                                    </button>
                                                    {order.orderStatus === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                                                                className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                                                                title="Xác nhận đơn hàng"
                                                            >
                                                                <FaCheck className="mr-1" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancel(order.id)}
                                                                className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                                                                title="Hủy đơn hàng"
                                                            >
                                                                <FaTimes className="mr-1" />
                                                            </button>
                                                        </>
                                                    )}
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

            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 font-montserrat">Chi Tiết Đơn Hàng</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {formatPaymentMethod(selectedOrder.paymentMethod)}
                                            </span>
                                        )
                                    },
                                    {
                                        label: 'Trạng Thái Thanh Toán',
                                        value: (
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedOrder.paymentStatus === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : selectedOrder.paymentStatus === 'PAID'
                                                    ? 'bg-green-100 text-green-800'
                                                    : selectedOrder.paymentStatus === 'FAILED'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {formatPaymentStatus(selectedOrder.paymentStatus)}
                                            </span>
                                        )
                                    },
                                    {
                                        label: 'Trạng Thái Đơn Hàng',
                                        value: (
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedOrder.orderStatus === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : selectedOrder.orderStatus === 'CONFIRMED'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : selectedOrder.orderStatus === 'SHIPPING'
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : selectedOrder.orderStatus === 'DELIVERED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
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
                                <div className="md:col-span-2">
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

export default AdminOrderManagement;