import React, { useState, useEffect } from 'react';
import { useCart } from '../../../Context/CartContext';
import { useLocation, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProfile } from '../../../services/api/userService';
import { createOrder } from '../../../services/api/orderService';

const OrderPage = () => {
    const { cartItems, totalPrice, clearCart, fetchCart, updateQuantity, removeItem, orderNow } = useCart();
    const location = useLocation();
    const orderNowItem = location.state?.orderNowItem;
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({ fullname: '', email: '', phoneNumber: '' });
    const [userLoading, setUserLoading] = useState(false);
    const [orderNowQuantity, setOrderNowQuantity] = useState(orderNowItem?.quantity || 1);

    const orderNowTotalPrice = orderNowItem ? orderNowItem.price * orderNowQuantity : 0;

    useEffect(() => {
        const fetchUserInfo = async () => {
            setUserLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Không tìm thấy token');
                    return;
                }

                const data = await getProfile(token);
                setUserInfo({
                    fullname: data.fullname || 'Chưa cập nhật',
                    email: data.email || 'Chưa cập nhật',
                    phoneNumber: data.phoneNumber || 'Chưa cập nhật',
                });
            } catch (error) {
                setError(error.message);
                console.error('Lỗi khi lấy thông tin người dùng:', error.message);
            } finally {
                setUserLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    const updateOrderNowQuantity = (delta) => {
        setOrderNowQuantity(prev => Math.max(1, prev + delta));
    };

    const handleCheckout = async () => {
        if (!deliveryAddress.trim()) {
            setError('Địa chỉ giao hàng không được để trống');
            return;
        }
        if (!paymentMethod) {
            setError('Vui lòng chọn hình thức thanh toán');
            return;
        }

        Swal.fire({
            title: 'Xác nhận đặt hàng',
            text: 'Bạn có chắc chắn muốn đặt hàng với thông tin này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 hover:shadow-md transition ease-in-out duration-200',
                cancelButton: 'px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 hover:shadow-md transition ease-in-out duration-200',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                setError('');
                try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error('Không tìm thấy token');

                    if (orderNowItem) {
                        await orderNow({
                            productId: orderNowItem.productId,
                            quantity: orderNowQuantity,
                            deliveryAddress,
                            paymentMethod,
                        });
                    } else {
                        await createOrder(token, {
                            deliveryAddress,
                            paymentMethod,
                        });
                        await clearCart();
                        await fetchCart();
                    }

                    toast.success('Đặt hàng thành công! Chúng tôi sẽ liên hệ để xác nhận.', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: 'light',
                    });

                    setDeliveryAddress('');
                    setPaymentMethod('');
                    if (orderNowItem) setOrderNowQuantity(1);
                } catch (error) {
                    setError(error.message);
                    console.error('Lỗi khi đặt hàng:', error.message);
                    toast.error(error.message, {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: 'light',
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                </div>

                {(cartItems.length === 0 && !orderNowItem) ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-lg mb-4">Giỏ hàng của bạn đang trống</p>
                        <Link
                            to="/menu"
                            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 hover:shadow-md transition ease-in-out duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Order Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-6">Thông Tin Đặt Hàng</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ tên
                                    </label>
                                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                                        {userLoading ? (
                                            <span className="inline-block w-20 h-4 bg-gray-200 animate-pulse rounded"></span>
                                        ) : (
                                            <span className="text-gray-800">{userInfo.fullname}</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                                        {userLoading ? (
                                            <span className="inline-block w-32 h-4 bg-gray-200 animate-pulse rounded"></span>
                                        ) : (
                                            <span className="text-gray-800">{userInfo.email}</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                                        {userLoading ? (
                                            <span className="inline-block w-24 h-4 bg-gray-200 animate-pulse rounded"></span>
                                        ) : (
                                            <span className="text-gray-800">{userInfo.phoneNumber}</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Địa chỉ giao hàng
                                    </label>
                                    <input
                                        type="text"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-400 transition ease-in-out duration-200"
                                        placeholder="Nhập địa chỉ giao hàng chi tiết..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hình thức thanh toán
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-400 transition ease-in-out duration-200"
                                    >
                                        <option value="" disabled>
                                            Chọn hình thức thanh toán
                                        </option>
                                        <option value="CASH_ON_DELIVERY">Thanh toán khi nhận hàng (COD)</option>
                                        <option value="ONLINE_PAYMENT">Thanh toán trực tuyến</option>
                                    </select>
                                </div>
                                {error && (
                                    <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded-lg">
                                        <p className="text-red-700 text-sm">{error}</p>
                                    </div>
                                )}
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 hover:shadow-md transition ease-in-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Đang xử lý...' : `Xác Nhận Đặt Hàng ${(orderNowItem ? orderNowTotalPrice : totalPrice).toLocaleString('vi-VN')} VNĐ`}
                                </button>
                                <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Thông tin thanh toán được lưu dưới dạng văn bản</span>
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Cart Items */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-6">Sản phẩm ({orderNowItem ? 1 : cartItems.length})</h2>
                            <div className="space-y-6">
                                {(orderNowItem ? [orderNowItem] : cartItems).map((item) => (
                                    <div key={item.productId || item.id} className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Đơn giá: {(item.price || 0).toLocaleString('vi-VN')} VNĐ</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <button
                                                    onClick={() => orderNowItem ? updateOrderNowQuantity(-1) : updateQuantity(item.productId, -1)}
                                                    className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 hover:shadow-md transition ease-in-out duration-200"
                                                    aria-label="Giảm số lượng"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="text-gray-700 font-medium">
                                                    {orderNowItem ? orderNowQuantity : item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => orderNowItem ? updateOrderNowQuantity(1) : updateQuantity(item.productId, 1)}
                                                    className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 hover:shadow-md transition ease-in-out duration-200"
                                                    aria-label="Tăng số lượng"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            {!orderNowItem && (
                                                <>
                                                    <button
                                                        onClick={() => removeItem(item.productId)}
                                                        className="text-indigo-600 text-sm hover:text-indigo-800 hover:underline transition ease-in-out duration-200"
                                                        aria-label={`Xóa ${item.name}`}
                                                    >
                                                        Xóa
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <p className="font-medium">{(item.price * (orderNowItem ? orderNowQuantity : item.quantity)).toLocaleString('vi-VN')} VNĐ</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Tổng tiền</span>
                                    <span>{(orderNowItem ? orderNowTotalPrice : totalPrice).toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderPage;