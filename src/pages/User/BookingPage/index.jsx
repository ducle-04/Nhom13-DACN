import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Booking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    bookingDate: '',
    bookingTime: '',
    numberOfGuests: 1,
    area: 'indoor',
    specialRequests: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate phone number (8-15 digits)
    if (!/^[0-9]{8,15}$/.test(formData.phoneNumber)) {
      setError('Số điện thoại phải có từ 8 đến 15 số.');
      setLoading(false);
      return;
    }

    // Validate number of guests
    if (formData.numberOfGuests < 1 || formData.numberOfGuests > 20) {
      setError('Số khách phải từ 1 đến 20.');
      setLoading(false);
      return;
    }

    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập để đặt bàn.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/booking/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Đặt bàn thành công! Chúng tôi sẽ liên hệ để xác nhận.');
      // Reset form
      setFormData({
        fullName: '',
        phoneNumber: '',
        bookingDate: '',
        bookingTime: '',
        numberOfGuests: 1,
        area: 'indoor',
        specialRequests: '',
      });
      navigate('/booking/history'); // Redirect to booking history
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Đã có lỗi xảy ra khi đặt bàn.');
      } else {
        setError('Không thể kết nối đến server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-amber-500 text-center mb-6 font-montserrat">
          Đặt Bàn - FoodieHub
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông Tin Cá Nhân</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Họ và Tên *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Nhập họ và tên"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Số Điện Thoại *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{8,15}"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Nhập số điện thoại (8-15 số)"
                  aria-required="true"
                />
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Chi Tiết Đặt Bàn</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">
                  Ngày *
                </label>
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700">
                  Giờ *
                </label>
                <input
                  type="time"
                  id="bookingTime"
                  name="bookingTime"
                  value={formData.bookingTime}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700">
                  Số Khách *
                </label>
                <input
                  type="number"
                  id="numberOfGuests"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  required
                  min="1"
                  max="20"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                  Khu Vực *
                </label>
                <select
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-required="true"
                >
                  <option value="indoor">Khu vực chính</option>
                  <option value="vip">Phòng VIP</option>
                  <option value="outdoor">Khu vườn</option>
                  <option value="terrace">Sân thượng</option>
                </select>
              </div>
              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
                  Yêu Cầu Đặc Biệt
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Nhập yêu cầu đặc biệt (nếu có)"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-600'}`}
            >
              {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Bàn'}
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Booking;