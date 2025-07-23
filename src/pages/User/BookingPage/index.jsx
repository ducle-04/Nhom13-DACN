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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-4">
            Đặt Bàn
          </h1>
          <p className="text-xl text-gray-600 font-medium">FoodieHub Restaurant</p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
          {/* Form Content */}
          <div className="p-8 lg:p-12">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg mb-8 animate-pulse">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Personal Information Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Thông Tin Cá Nhân</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
                      placeholder="Nhập họ và tên của bạn"
                      aria-required="true"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
                      placeholder="Nhập số điện thoại (8-15 số)"
                      aria-required="true"
                    />
                  </div>
                </div>
              </div>

              {/* Booking Details Section */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex items-center mb-6">
                  <div className="bg-amber-500 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6-6m0 0l6-6m-6 6l-6 6m6-6v8" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Chi Tiết Đặt Bàn</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="bookingDate" className="block text-sm font-semibold text-gray-700 mb-2">
                      Ngày đặt bàn *
                    </label>
                    <input
                      type="date"
                      id="bookingDate"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300"
                      aria-required="true"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="bookingTime" className="block text-sm font-semibold text-gray-700 mb-2">
                      Thời gian *
                    </label>
                    <input
                      type="time"
                      id="bookingTime"
                      name="bookingTime"
                      value={formData.bookingTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300"
                      aria-required="true"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="numberOfGuests" className="block text-sm font-semibold text-gray-700 mb-2">
                      Số lượng khách *
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300"
                      aria-required="true"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="area" className="block text-sm font-semibold text-gray-700 mb-2">
                      Khu vực ưa thích *
                    </label>
                    <select
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 group-hover:border-amber-300"
                      aria-required="true"
                    >
                      <option value="indoor">🏢 Khu vực chính</option>
                      <option value="vip">👑 Phòng VIP</option>
                      <option value="outdoor">🌳 Khu vườn</option>
                      <option value="terrace">🌃 Sân thượng</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Requests Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-center mb-6">
                  <div className="bg-green-500 rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Yêu Cầu Đặc Biệt</h2>
                </div>
                <div className="group">
                  <label htmlFor="specialRequests" className="block text-sm font-semibold text-gray-700 mb-2">
                    Ghi chú thêm (tùy chọn)
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 group-hover:border-green-300 resize-none"
                    placeholder="Ví dụ: Dị ứng thực phẩm, trang trí sinh nhật, yêu cầu bàn gần cửa sổ..."
                    rows="4"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg transform transition-all duration-200 ${loading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-amber-600 hover:to-orange-600 hover:shadow-xl hover:scale-105 active:scale-95'
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Xác Nhận Đặt Bàn
                    </div>
                  )}
                </button>
                <Link
                  to="/"
                  className="px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold rounded-xl shadow-lg hover:from-gray-500 hover:to-gray-600 hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 text-center"
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hủy Bỏ
                  </div>
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Cần hỗ trợ? Liên hệ hotline:
            <span className="font-bold text-amber-600 ml-2">1900-1234</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Booking;