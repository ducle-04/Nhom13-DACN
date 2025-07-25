import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBooking } from '../../../services/api/bookingService';

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

    // Input validation
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

    // Confirmation dialog
    Swal.fire({
      title: 'Xác nhận đặt bàn',
      text: 'Bạn có chắc chắn muốn đặt bàn với thông tin này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
        cancelButton: 'px-6 py-3 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await createBooking(token, formData);

          toast.success('Đặt bàn thành công! Chúng tôi sẽ liên hệ để xác nhận.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
          });

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
        } catch (err) {
          setError(err.message || 'Đã có lỗi xảy ra khi đặt bàn.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ToastContainer />

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-violet-300/30 to-blue-300/30 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl mb-4 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-1-1V8a1 1 0 011-1h5z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent mb-2">
            Đặt Bàn
          </h1>
          <p className="text-lg text-slate-700 font-medium">Tại FoodieHub Restaurant</p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Restaurant Info & Offers */}
          <div className="lg:col-span-2 space-y-6">
            {/* Restaurant Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-6 0H7m6 0h2" />
                </svg>
                <span>Khám Phá FoodieHub</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-xl overflow-hidden shadow-md group">
                  <img
                    src="/images/about/img1.jpg"
                    alt="Restaurant Indoor"
                    className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <p className="absolute bottom-2 left-2 text-white font-semibold text-sm">Khu vực trong nhà</p>
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-md group">
                  <img
                    src="/images/about/img2.jpg"
                    alt="Restaurant Outdoor"
                    className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <p className="absolute bottom-2 left-2 text-white font-semibold text-sm">Khu vườn ngoài trời</p>
                </div>
              </div>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                FoodieHub mang đến trải nghiệm ẩm thực tinh tế với không gian trong nhà hiện đại và khu vườn ngoài trời hòa quyện thiên nhiên. Không chỉ là điểm đến cho những bữa ăn ngon miệng, FoodieHub còn là nơi bạn có thể cảm nhận sự thư giãn trong từng khoảnh khắc.
              </p>
            </div>

            {/* Special Offers & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100/50 shadow-lg transition-all duration-300 hover:shadow-xl">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  <span>Ưu Đãi Đặc Biệt</span>
                </h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Giảm 20% cho đặt bàn trước 48 giờ (T2-T5)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Tặng cocktail cho nhóm 6+ người</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Miễn phí trang trí bàn tiệc</span>
                  </li>
                </ul>
                <p className="mt-3 text-xs text-slate-500">*Ưu đãi áp dụng đến 31/12/2025</p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-100/50 shadow-lg transition-all duration-300 hover:shadow-xl">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span>Lưu Ý *</span>
                </h3>
                <ul className="space-y-2 text-slate-600 text-sm">
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Đến đúng giờ (muộn quá 15 phút có thể mất bàn)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Hủy bàn trước 24h (phòng VIP có phí phạt)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Ghi rõ dị ứng thực phẩm và yêu cầu đặc biệt</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 lg:p-8 transition-all duration-500 hover:shadow-2xl">
              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200 rounded-xl flex items-center space-x-3 shadow-md animate-pulse">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Thông tin cá nhân</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label htmlFor="fullName" className="block font-medium text-sm text-slate-700 mb-1.5 truncate">
                        Họ và Tên *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="block w-full min-w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition-all duration-300 bg-white/50 placeholder-slate-400 text-slate-800 group-hover:border-violet-300"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="phoneNumber" className="block font-medium text-sm text-slate-700 mb-1.5 truncate">
                        Số Điện Thoại *
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        pattern="[0-9]{8,15}"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="block w-full min-w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition-all duration-300 bg-white/50 placeholder-slate-400 text-slate-800 group-hover:border-violet-300"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>Thông tin đặt bàn</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    <div className="group">
                      <label htmlFor="bookingDate" className="block font-medium text-sm text-slate-700 mb-1.5 truncate">
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
                        className="block w-full min-w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition-all duration-300 bg-white/50 text-slate-800 group-hover:border-violet-300"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="bookingTime" className="block font-medium text-sm text-slate-700 mb-1.5 truncate">
                        Giờ Đặt *
                      </label>
                      <input
                        type="time"
                        id="bookingTime"
                        name="bookingTime"
                        required
                        value={formData.bookingTime}
                        onChange={handleChange}
                        className="block w-full min-w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition-all duration-300 bg-white/50 text-slate-800 group-hover:border-violet-300"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="numberOfGuests" className="block font-medium text-sm text-slate-700 mb-1.5 truncate">
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
                        className="block w-full min-w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition-all duration-300 bg-white/50 text-slate-800 group-hover:border-violet-300"
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="area" className="block font-medium text-sm text-slate-700 mb-1.5 truncate">
                        Khu Vực *
                      </label>
                      <select
                        id="area"
                        name="area"
                        required
                        value={formData.area}
                        onChange={handleChange}
                        className="block w-full min-w-full border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition-all duration-300 bg-white/50 text-slate-800 group-hover:border-violet-300"
                      >
                        <option value="indoor">🏢 Trong nhà</option>
                        <option value="vip">👑 Phòng VIP</option>
                        <option value="outdoor">🌳 Khu vườn</option>
                        <option value="terrace">🌃 Sân thượng</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span>Yêu cầu đặc biệt</span>
                  </h3>
                  <div className="group">
                    <label htmlFor="specialRequests" className="block font-medium text-sm text-slate-700 mb-1.5 truncate">
                      Ghi chú đặc biệt
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      rows="3"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      className="block w-full min-w-full border border-slate-200 rounded-xl px-3 py-2 resize-none focus:ring-2 focus:ring-violet-400 focus:border-violet-500 transition-all duration-300 bg-white/50 placeholder-slate-400 text-slate-800 group-hover:border-violet-300"
                      placeholder="Ví dụ: Dị ứng thực phẩm, tổ chức sinh nhật, bàn gần cửa sổ..."
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`relative px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:from-violet-700 hover:to-indigo-700'}`}
                  >
                    <span className="flex items-center justify-center space-x-2">
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
                    className="px-8 py-3 bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-slate-300 hover:to-slate-400 transition-all duration-300 hover:scale-105"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span>Hủy Bỏ</span>
                    </span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
          <p className="text-slate-700 text-lg font-medium">
            Cần hỗ trợ? Gọi ngay:
            <span className="font-bold text-violet-600 ml-2">1900-1234</span>
          </p>
          <div className="mt-3 flex items-center justify-center space-x-6 text-sm text-slate-600">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Bảo mật thông tin</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
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