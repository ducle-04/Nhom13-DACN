import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Vui lòng đăng nhập lại');
            }

            const response = await axios.get('http://localhost:8080/api/orders', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const orderData = response.data.data || [];
            setOrders(orderData);
        } catch (error) {
            let errorMessage = 'Lỗi không xác định';
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = 'Vui lòng đăng nhập lại';
                    localStorage.removeItem('token');
                    navigate('/login');
                } else if (error.response.status === 404) {
                    errorMessage = 'Không tìm thấy đơn hàng';
                } else {
                    errorMessage = error.response.data.message || 'Lỗi máy chủ';
                }
            } else {
                errorMessage = error.message;
            }
            setError(errorMessage);
            console.error('Lỗi khi lấy danh sách đơn hàng:', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setOrders(orders.filter((order) => order.id !== id));
            alert('Hủy đơn hàng thành công!');
        } catch (error) {
            let errorMessage = 'Lỗi khi hủy đơn hàng';
            if (error.response) {
                errorMessage = error.response.data.message || 'Lỗi máy chủ';
            } else {
                errorMessage = error.message;
            }
            alert(errorMessage);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const statusStyles = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        CONFIRMED: 'bg-blue-100 text-blue-800',
        SHIPPING: 'bg-orange-100 text-orange-800',
        DELIVERED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };

    const formatStatus = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'CONFIRMED':
                return 'Đã xác nhận';
            case 'SHIPPING':
                return 'Đang giao hàng';
            case 'DELIVERED':
                return 'Đã giao';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status || 'Không xác định';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
                    Lịch Sử Đơn Hàng
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                        <p className="ml-4 text-gray-600 text-lg">Đang tải danh sách đơn hàng...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                        <p className="text-red-700">{error}</p>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="grid gap-6">
                        {orders.map((order, index) => (
                            <div
                                key={order.id || `order-${index}`}
                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            Đơn hàng #{order.id || 'N/A'}
                                        </h3>
                                        <p className="text-gray-600 mt-1">
                                            <span className="font-medium">Địa chỉ giao hàng:</span>{' '}
                                            {order.deliveryAddress || 'Không có thông tin'}
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            <span className="font-medium">Ngày giao hàng:</span>{' '}
                                            {order.deliveryDate
                                                ? new Date(order.deliveryDate).toLocaleString('vi-VN', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })
                                                : 'Chưa xác định'}
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            <span className="font-medium">Trạng thái:</span>{' '}
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.orderStatus] || 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {formatStatus(order.orderStatus)}
                                            </span>
                                        </p>
                                        {order.orderItems && order.orderItems.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-gray-700 font-medium">Mặt hàng:</p>
                                                <ul className="mt-2 space-y-2">
                                                    {order.orderItems.map((item, itemIndex) => (
                                                        <li
                                                            key={item.id || `item-${index}-${itemIndex}`}
                                                            className="text-gray-600 text-sm"
                                                        >
                                                            <span className="font-medium">
                                                                {item.productName || 'Không xác định'}
                                                            </span>{' '}
                                                            - Số lượng: {item.quantity || 0} - Giá:{' '}
                                                            {(item.unitPrice || 0).toLocaleString('vi-VN')} VNĐ
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-green-600">
                                            {(order.totalAmount || 0).toLocaleString('vi-VN')} VNĐ
                                        </p>
                                        {(order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED') && (
                                            <button
                                                onClick={() => handleCancel(order.id)}
                                                className="mt-3 flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                                            >
                                                <FaTimes className="mr-2" />
                                                Hủy Đơn
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-xl shadow-md text-center">
                        <p className="text-gray-600 text-lg">Bạn chưa có đơn hàng nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;