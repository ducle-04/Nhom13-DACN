import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/booking';

const getAuthHeaders = (token) => {
    if (!token) {
        console.warn('Không tìm thấy token trong localStorage');
        return {};
    }
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

export const createBooking = async (token, bookingData) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/create`,
            bookingData,
            {
                headers: getAuthHeaders(token),
                timeout: 5000,
            }
        );
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi tạo đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getBookingHistory = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/history`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy lịch sử đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getBookingDetails = async (token, bookingId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${bookingId}`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy chi tiết đơn đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const cancelBooking = async (token, bookingId) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/user/cancel/${bookingId}`, null, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi hủy đơn đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};