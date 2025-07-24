import React, { useState, useEffect } from 'react';
import { useCart } from '../../../Context/CartContext';
import { useLocation } from 'react-router-dom';
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
    const [deliveryDate, setDeliveryDate] = useState('');
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
        if (deliveryDate && new Date(deliveryDate) < new Date()) {
            setError('Ngày giao hàng không được trước ngày hiện tại');
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
                confirmButton: 'px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
                cancelButton: 'px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
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
                            deliveryDate: deliveryDate || null,
                            paymentMethod,
                        });
                    } else {
                        await createOrder(token, {
                            deliveryAddress,
                            deliveryDate: deliveryDate || null,
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
                    setDeliveryDate('');
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Đặt Hàng
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                {(cartItems.length === 0 && !orderNowItem) ? (
                    <div className="bg-white/80 backdrop-blur-lg p-12 rounded-3xl shadow-2xl border border-white/20 text-center transform hover:scale-105 transition-all duration-300">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-xl mb-6">Giỏ hàng của bạn đang trống</p>
                        <a
                            href="/menu"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tiếp tục mua sắm
                        </a>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
                            <div className="flex items-center mb-8">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Sản phẩm ({orderNowItem ? 1 : cartItems.length})
                                </h2>
                            </div>

                            <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
                                {(orderNowItem ? [orderNowItem] : cartItems).map((item, index) => (
                                    <div
                                        key={item.productId || item.id}
                                        className="group flex items-center bg-gradient-to-r from-white to-slate-50 rounded-2xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                            animation: 'slideInUp 0.6s ease-out forwards'
                                        }}
                                    >
                                        <div className="relative overflow-hidden rounded-xl mr-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover transform group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                                            <p className="text-gray-500 text-sm mb-3">
                                                Đơn giá: <span className="font-medium text-blue-600">{(item.price || 0).toLocaleString('vi-VN')} VNĐ</span>
                                            </p>
                                            {item.description && (
                                                <p className="text-gray-500 text-sm mb-3">
                                                    Mô tả: <span className="font-medium">{item.description}</span>
                                                </p>
                                            )}
                                            {item.category && (
                                                <p className="text-gray-500 text-sm mb-3">
                                                    Danh mục: <span className="font-medium">{item.category}</span>
                                                </p>
                                            )}
                                            {item.productType && (
                                                <p className="text-gray-500 text-sm mb-3">
                                                    Loại sản phẩm: <span className="font-medium">{item.productType}</span>
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                                    <button
                                                        onClick={() => orderNowItem ? updateOrderNowQuantity(-1) : updateQuantity(item.productId, -1)}
                                                        className="w-8 h-8 bg-white text-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 shadow-sm"
                                                        aria-label="Giảm số lượng"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <span className="text-gray-700 font-semibold w-12 text-center">
                                                        {orderNowItem ? orderNowQuantity : item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => orderNowItem ? updateOrderNowQuantity(1) : updateQuantity(item.productId, 1)}
                                                        className="w-8 h-8 bg-white text-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 shadow-sm"
                                                        aria-label="Tăng số lượng"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {!orderNowItem && (
                                                    <button
                                                        onClick={() => removeItem(item.productId)}
                                                        className="ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                                        aria-label={`Xóa ${item.name}`}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right ml-4">
                                            <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                {(item.price * (orderNowItem ? orderNowQuantity : item.quantity)).toLocaleString('vi-VN')} VNĐ
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gradient-to-r from-transparent via-gray-200 to-transparent">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                                    <p className="text-2xl font-bold flex justify-between items-center">
                                        <span className="text-gray-700">Tổng tiền:</span>
                                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            {(orderNowItem ? orderNowTotalPrice : totalPrice).toLocaleString('vi-VN')} VNĐ
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
                            <div className="flex items-center mb-8">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Thông Tin Đặt Hàng
                                </h2>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Thông tin người dùng
                                        </h3>
                                        <a
                                            href="/profile"
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Chỉnh sửa
                                        </a>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center p-3 bg-white/60 rounded-xl">
                                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-gray-600 text-sm">
                                                <span className="font-medium">Họ tên:</span>{' '}
                                                {userLoading ? (
                                                    <span className="inline-block w-20 h-4 bg-gray-200 animate-pulse rounded"></span>
                                                ) : (
                                                    <span className="text-gray-800">{userInfo.fullname || 'Chưa cập nhật'}</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center p-3 bg-white/60 rounded-xl">
                                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-600 text-sm">
                                                <span className="font-medium">Email:</span>{' '}
                                                {userLoading ? (
                                                    <span className="inline-block w-32 h-4 bg-gray-200 animate-pulse rounded"></span>
                                                ) : (
                                                    <span className="text-gray-800">{userInfo.email || 'Chưa cập nhật'}</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center p-3 bg-white/60 rounded-xl">
                                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-gray-600 text-sm">
                                                <span className="font-medium">Số điện thoại:</span>{' '}
                                                {userLoading ? (
                                                    <span className="inline-block w-24 h-4 bg-gray-200 animate-pulse rounded"></span>
                                                ) : (
                                                    <span className="text-gray-800">{userInfo.phoneNumber || 'Chưa cập nhật'}</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center text-sm font-semibold text-gray-700">
                                        <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Địa chỉ giao hàng
                                    </label>
                                    <input
                                        type="text"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                                        placeholder="Nhập địa chỉ giao hàng chi tiết..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center text-sm font-semibold text-gray-700">
                                        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Ngày giao hàng (tùy chọn)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center text-sm font-semibold text-gray-700">
                                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Hình thức thanh toán
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                                    >
                                        <option value="" disabled>
                                            Chọn hình thức thanh toán
                                        </option>
                                        <option value="CASH">💵 Tiền mặt</option>
                                        <option value="CARD">💳 Thẻ tín dụng/Thẻ ghi nợ</option>
                                        <option value="BANK_TRANSFER">🏦 Chuyển khoản ngân hàng</option>
                                        <option value="MOBILE_PAYMENT">📱 Thanh toán qua ứng dụng di động</option>
                                    </select>
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                                    <p className="text-2xl font-bold flex justify-between items-center">
                                        <span className="text-gray-700 flex items-center">
                                            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Tổng tiền:
                                        </span>
                                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent text-3xl">
                                            {(orderNowItem ? orderNowTotalPrice : totalPrice).toLocaleString('vi-VN')} VNĐ
                                        </span>
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-4 rounded-2xl shadow-lg animate-shake">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-red-700 font-medium">{error}</p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    {loading ? (
                                        <span className="flex items-center justify-center relative z-10">
                                            <svg
                                                className="animate-spin h-6 w-6 mr-3 text-white"
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
                                        <span className="flex items-center justify-center relative z-10">
                                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Xác Nhận Đặt Hàng
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #2563eb, #7c3aed);
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }

                .shadow-3xl {
                    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
                }

                @keyframes gradient-border {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .gradient-border {
                    background: linear-gradient(-45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b);
                    background-size: 400% 400%;
                    animation: gradient-border 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default OrderPage;