import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const API_BASE_URL = 'http://localhost:8080/api/cart';

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Không tìm thấy token trong localStorage');
            return {};
        }
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    };

    const fetchCart = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}`, {
                headers: getAuthHeaders(),
            });
            const cartData = response.data.data || response.data.cart;
            if (!cartData) {
                setCartItems([]);
                setTotalPrice(0);
                return;
            }
            const items = cartData.cartItems.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.productName,
                image: item.productImage,
                price: item.price,
                quantity: item.quantity,
            }));
            setCartItems(items);
            setTotalPrice(cartData.totalPrice);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi không xác định';
            console.error('Lỗi khi lấy giỏ hàng:', errorMessage);
            setCartItems([]);
            setTotalPrice(0);
        }
    };

    const addToCart = async (productId, quantity) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/add`,
                null,
                {
                    params: { productId, quantity },
                    headers: getAuthHeaders(),
                }
            );
            const cartData = response.data.data || response.data.cart;
            const items = cartData.cartItems.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.productName,
                image: item.productImage,
                price: item.price,
                quantity: item.quantity,
            }));
            setCartItems(items);
            setTotalPrice(cartData.totalPrice);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi không xác định';
            console.error('Lỗi khi thêm vào giỏ hàng:', errorMessage);
            throw new Error(errorMessage);
        }
    };

    const updateQuantity = async (productId, delta) => {
        const item = cartItems.find(item => item.productId === productId);
        if (!item) return;

        const newQuantity = item.quantity + delta;
        if (newQuantity < 0) return;

        try {
            const response = await axios.put(
                `${API_BASE_URL}/update`,
                null,
                {
                    params: { productId, quantity: newQuantity },
                    headers: getAuthHeaders(),
                }
            );
            const cartData = response.data.data || response.data.cart;
            const items = cartData.cartItems.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.productName,
                image: item.productImage,
                price: item.price,
                quantity: item.quantity,
            }));
            setCartItems(items);
            setTotalPrice(cartData.totalPrice);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi không xác định';
            console.error('Lỗi khi cập nhật số lượng:', errorMessage);
            throw new Error(errorMessage);
        }
    };

    const removeItem = async (productId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/remove`,
                {
                    params: { productId },
                    headers: getAuthHeaders(),
                }
            );
            const cartData = response.data.data || response.data.cart;
            const items = cartData.cartItems.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.productName,
                image: item.productImage,
                price: item.price,
                quantity: item.quantity,
            }));
            setCartItems(items);
            setTotalPrice(cartData.totalPrice);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi không xác định';
            console.error('Lỗi khi xóa sản phẩm:', errorMessage);
            throw new Error(errorMessage);
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/clear`, {
                headers: getAuthHeaders(),
            });
            setCartItems([]);
            setTotalPrice(0);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi không xác định';
            console.error('Lỗi khi xóa giỏ hàng:', errorMessage);
            throw new Error(errorMessage);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, totalPrice, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);