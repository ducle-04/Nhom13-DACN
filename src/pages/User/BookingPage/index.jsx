import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Dùng cho hộp thoại xác nhận
import { toast, ToastContainer } from 'react-toastify'; // Nhập react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS của react-toastify

function Booking() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Kiểm tra đầu vào
    if (!/^[0-9]{8,15}$/.test(formData.phoneNumber)) {
      setError('Số điện thoại phải có từ 8 đến 15 số.');
      setLoading(false);
      return;
    }

    if (formData.numberOfGuests < 1 || formData.numberOfGuests > 20) {
      setError('Số khách phải từ 1 đến 20.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập để đặt bàn.');
      setLoading(false);
      return;
    }

    // Hiển thị hộp thoại xác nhận
    Swal.fire({
      title: 'Xác nhận đặt bàn',
      text: 'Bạn có chắc chắn muốn đặt bàn với thông tin này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
        cancelButton: 'px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            'http://localhost:8080/api/booking/create',
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          // Hiển thị thông báo thành công bằng react-toastify
          toast.success('Đặt bàn thành công! Chúng tôi sẽ liên hệ để xác nhận.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
          });

          // Đặt lại form sau khi thành công
          setFormData({
            fullName: '',
            phoneNumber: '',
            bookingDate: '',
            bookingTime: '',
            numberOfGuests: 1,
            area: 'indoor',
            specialRequests: '',
          });
        } catch (err) {
          if (err.response) {
            setError(err.response.data.error || 'Đã có lỗi xảy ra khi đặt bàn.');
          } else {
            setError('Không thể kết nối đến máy chủ.');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Hủy bỏ xác nhận, dừng loading
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-8 relative overflow-hidden">
      {/* Thêm ToastContainer để hiển thị thông báo */}
      <ToastContainer />

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-violet-300/20 to-blue-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-1-1V8a1 1 0 011-1h5z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent sm:text-6xl mb-3">
            Đặt Bàn
          </h1>
          <p className="text-xl text-slate-600 font-medium">Tại FoodieHub Restaurant</p>
          <div className="mt-6 w-32 h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full mx-auto"></div>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-sm bg-white/80 rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-12 transition-all duration-500 hover:shadow-3xl">
          {error && (
            <div className="mb-8 p-5 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 rounded-2xl flex items-start space-x-3 animate-pulse shadow-lg">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Personal Info Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Thông tin cá nhân</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="fullName" className="block font-semibold text-sm text-slate-700 mb-2">
                    Họ và Tên *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full border-2 border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-slate-400 text-slate-800 group-hover:border-slate-300"
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="phoneNumber" className="block font-semibold text-sm text-slate-700 mb-2">
                    Số Điện Thoại *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      pattern="[0-9]{8,15}"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="block w-full border-2 border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-slate-400 text-slate-800 group-hover:border-slate-300"
                      placeholder="Nhập số điện thoại (8-15 số)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Info Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Thông tin đặt bàn</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="group">
                  <label htmlFor="bookingDate" className="block font-semibold text-sm text-slate-700 mb-2">
                    Ngày Đặt *
                  </label>
                  <input
                    type="date"
                    id="bookingDate"
                    name="bookingDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.bookingDate}
                    onChange={handleChange}
                    className="block w-full border-2 border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 bg-white/70 backdrop-blur-sm text-slate-800 group-hover:border-slate-300"
                  />
                </div>
                <div className="group">
                  <label htmlFor="bookingTime" className="block font-semibold text-sm text-slate-700 mb-2">
                    Giờ Đặt *
                  </label>
                  <input
                    type="time"
                    id="bookingTime"
                    name="bookingTime"
                    required
                    value={formData.bookingTime}
                    onChange={handleChange}
                    className="block w-full border-2 border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 bg-white/70 backdrop-blur-sm text-slate-800 group-hover:border-slate-300"
                  />
                </div>
                <div className="group">
                  <label htmlFor="numberOfGuests" className="block font-semibold text-sm text-slate-700 mb-2">
                    Số Khách *
                  </label>
                  <input
                    type="number"
                    id="numberOfGuests"
                    name="numberOfGuests"
                    required
                    min="1"
                    max="20"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    className="block w-full border-2 border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 bg-white/70 backdrop-blur-sm text-slate-800 group-hover:border-slate-300"
                  />
                </div>
                <div className="group">
                  <label htmlFor="area" className="block font-semibold text-sm text-slate-700 mb-2">
                    Khu Vực *
                  </label>
                  <select
                    id="area"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleChange}
                    className="block w-full border-2 border-slate-200 rounded-2xl px-5 py-3.5 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 bg-white/70 backdrop-blur-sm text-slate-800 group-hover:border-slate-300"
                  >
                    <option value="indoor">🏢 Trong nhà</option>
                    <option value="vip">👑 Phòng VIP</option>
                    <option value="outdoor">🌳 Khu vườn</option>
                    <option value="terrace">🌃 Sân thượng</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Special Request Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Yêu cầu đặc biệt</span>
              </h3>
              <div className="group">
                <label htmlFor="specialRequests" className="block font-semibold text-sm text-slate-700 mb-2">
                  Ghi chú đặc biệt
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows="5"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className="block w-full border-2 border-slate-200 rounded-2xl px-5 py-4 resize-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-slate-400 text-slate-800 group-hover:border-slate-300"
                  placeholder="Ví dụ: Dị ứng thực phẩm, tổ chức sinh nhật, yêu cầu bàn gần cửa sổ..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button
                type="submit"
                disabled={loading}
                className={`relative px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform ${loading ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:scale-105 hover:from-violet-700 hover:to-indigo-700'
                  } overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center space-x-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Xác Nhận Đặt Bàn</span>
                    </>
                  )}
                </span>
              </button>
              <Link
                to="/"
                className="px-8 py-4 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-bold rounded-2xl hover:from-slate-200 hover:to-slate-300 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-105 group"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Hủy Bỏ</span>
                </span>
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50">
          <p className="text-slate-600 text-lg">
            Cần hỗ trợ? Gọi ngay:
            <span className="font-bold text-violet-600 ml-2 text-xl">1900-1234</span>
          </p>
          <div className="mt-3 flex items-center justify-center space-x-4 text-sm text-slate-500">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Bảo mật thông tin</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Xác nhận nhanh chóng</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;