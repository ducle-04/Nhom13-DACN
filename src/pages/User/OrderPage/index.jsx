import React, { useState, useEffect } from 'react';
import { useCart } from '../../../Context/CartContext';
import axios from 'axios';

const OrderPage = () => {
    const { cartItems, totalPrice, clearCart, fetchCart, updateQuantity, removeItem } = useCart();
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({ fullname: '', email: '', phoneNumber: '' });
    const [userLoading, setUserLoading] = useState(false);

    // Lấy thông tin người dùng khi component được mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            setUserLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Không tìm thấy token');
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setUserInfo({
                    fullname: response.data.fullname || 'Chưa cập nhật',
                    email: response.data.email || 'Chưa cập nhật',
                    phoneNumber: response.data.phoneNumber || 'Chưa cập nhật',
                });
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message || 'Lỗi khi lấy thông tin người dùng';
                setError(errorMessage);
                console.error('Lỗi khi lấy thông tin người dùng:', errorMessage);
            } finally {
                setUserLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const handleCheckout = async () => {
        if (!deliveryAddress.trim()) {
            setError('Địa chỉ giao hàng không được để trống');
            return;
        }
        if (deliveryDate && new Date(deliveryDate) < new Date()) {
            setError('Ngày giao hàng không được trước ngày hiện tại');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Không tìm thấy token');

            const response = await axios.post(
                'http://localhost:8080/api/orders',
                {
                    deliveryAddress,
                    deliveryDate: deliveryDate || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                alert('Đặt hàng thành công!');
                await clearCart();
                await fetchCart();
                setDeliveryAddress('');
                setDeliveryDate('');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
            setError(errorMessage);
            console.error('Lỗi khi đặt hàng:', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                    Đặt Hàng
                </h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống</p>
                        <a
                            href="/products"
                            className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Tiếp tục mua sắm
                        </a>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Cart Items Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sản phẩm</h2>
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center border-b border-gray-200 py-4 last:border-b-0"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-md mr-4"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-gray-500 text-sm">
                                                Đơn giá: {(item.price || 0).toLocaleString('vi-VN')} VNĐ
                                            </p>
                                            <div className="flex items-center space-x-4 mt-2">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, -1)}
                                                        className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                                                        aria-label="Giảm số lượng"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="text-gray-700 font-medium w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, 1)}
                                                        className="w-8 h-8 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                                                        aria-label="Tăng số lượng"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.productId)}
                                                    className="text-red-500 hover:text-red-600 transition-colors duration-200"
                                                    aria-label={`Xóa ${item.name}`}
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-900 font-medium">
                                            {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-xl font-semibold text-gray-900 flex justify-between">
                                    <span>Tổng tiền:</span>
                                    <span className="text-green-600">{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                </p>
                            </div>
                        </div>

                        {/* Order Form Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông Tin Đặt Hàng</h2>
                            <div className="space-y-6">
                                {/* User Info */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-medium text-gray-900">Thông tin người dùng</h3>
                                        <a
                                            href="/profile"
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            Chỉnh sửa
                                        </a>
                                    </div>
                                    <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-medium">Họ tên:</span>{' '}
                                            {userLoading ? 'Đang tải...' : (userInfo.fullname || 'Chưa cập nhật')}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-medium">Email:</span>{' '}
                                            {userLoading ? 'Đang tải...' : (userInfo.email || 'Chưa cập nhật')}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            <span className="font-medium">Số điện thoại:</span>{' '}
                                            {userLoading ? 'Đang tải...' : (userInfo.phoneNumber || 'Chưa cập nhật')}
                                        </p>
                                    </div>
                                </div>
                                {/* Delivery Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Địa chỉ giao hàng
                                    </label>
                                    <input
                                        type="text"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                                        placeholder="Nhập địa chỉ giao hàng"
                                    />
                                </div>
                                {/* Delivery Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày giao hàng
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                                    />
                                </div>
                                {/* Total Price */}
                                <p className="text-xl font-semibold text-gray-900 flex justify-between">
                                    <span>Tổng tiền:</span>
                                    <span className="text-green-600">{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                </p>
                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                        <p className="text-red-700 text-sm">{error}</p>
                                    </div>
                                )}
                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin h-5 w-5 mr-2 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                                />
                                            </svg>
                                            Đang xử lý...
                                        </span>
                                    ) : (
                                        'Xác Nhận Đặt Hàng'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderPage;