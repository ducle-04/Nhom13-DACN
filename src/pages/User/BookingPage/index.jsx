import { useState } from 'react';
import { Link } from 'react-router-dom';

function Booking() {
  // State for form fields
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: 1,
    area: 'indoor',
    specialRequests: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking Data:', formData);
    // TODO: Send formData to an API or perform further processing
    alert('Đặt bàn thành công! Chúng tôi sẽ liên hệ để xác nhận.');
    // Reset form
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      guests: 1,
      area: 'indoor',
      specialRequests: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-amber-500 text-center mb-6 font-montserrat">
          Đặt Bàn - FoodieHub
        </h1>
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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Số Điện Thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Nhập số điện thoại (10 số)"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Nhập email"
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
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Ngày *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Giờ *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                  Số Khách *
                </label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  value={formData.guests}
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
                  <option value="indoor">Phòng VIP</option>
                  <option value="outdoor">Khu vườn</option>
                  <option value="private">Sân thượng</option>
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
              className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-200"
            >
              Xác Nhận Đặt Bàn
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