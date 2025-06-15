import React, { useState } from 'react';
import { FaUtensils, FaUsers, FaClipboardList, FaChartBar, FaStar, FaHamburger, FaArrowUp, FaArrowDown, FaUserCircle } from 'react-icons/fa';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, ArcElement);

function AdminDashboard() {
    // State cho thông tin admin và modal chỉnh sửa
    const [admin, setAdmin] = useState({ name: 'Quản trị viên', email: 'admin@example.com' });
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState(admin);

    // Demo số liệu, sau này lấy từ API/backend
    const stats = [
        { label: 'Tổng số món ăn', value: 85, icon: <FaUtensils />, color: 'blue' },
        { label: 'Người dùng', value: 620, icon: <FaUsers />, color: 'green' },
        { label: 'Đơn hàng', value: 450, icon: <FaClipboardList />, color: 'yellow' },
        { label: 'Đánh giá', value: 4.7, icon: <FaStar />, color: 'cyan' },
        { label: 'Doanh thu (triệu)', value: 780, icon: <FaChartBar />, color: 'red' },
    ];

    // Mock data cho biểu đồ doanh thu
    const revenueData = {
        labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6'],
        datasets: [
            {
                label: 'Doanh thu (triệu)',
                data: [100, 130, 160, 190, 150, 210],
                fill: false,
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f6',
                tension: 0.3,
            },
        ],
    };

    // Dữ liệu biểu đồ tổng quan danh mục món ăn
    const foodCategoryData = {
        labels: ['Pizza', 'Cơm', 'Phở', 'Hamburger', 'Khác'],
        datasets: [
            {
                label: 'Tỷ lệ danh mục món ăn',
                data: [30, 25, 20, 15, 10],
                backgroundColor: ['#3b82f6', '#22c55e', '#facc15', '#ef4444', '#a855f7'],
                borderWidth: 1,
            },
        ],
    };

    // Mock hoạt động gần đây
    const activities = [
        { type: 'Mới', color: 'blue', text: '1 người dùng vừa đặt Pizza', time: '2 phút trước' },
        { type: 'Thành công', color: 'green', text: 'Đơn hàng Phở đã giao thành công', time: '1 giờ trước' },
        { type: 'Chờ', color: 'yellow', text: '3 đơn hàng đang chờ xử lý', time: '3 giờ trước' },
        { type: 'Đánh giá', color: 'cyan', text: '1 người dùng vừa gửi đánh giá', time: 'Hôm nay' },
        { type: 'Hủy', color: 'red', text: '1 đơn hàng vừa bị hủy', time: 'Hôm qua' },
    ];

    // Mock top món ăn nổi bật
    const topFoods = [
        { name: 'Pizza Hải Sản', orders: 72, rating: 4.8 },
        { name: 'Phở Bò', orders: 65, rating: 4.9 },
        { name: 'Hamburger Gà', orders: 50, rating: 4.6 },
    ];

    // Thông tin tổng quan bổ sung
    const growthStats = [
        { label: 'Tăng trưởng doanh thu', value: '+10%', icon: <FaArrowUp />, color: 'green', desc: 'so với tháng trước' },
        { label: 'Tăng trưởng người dùng', value: '+15%', icon: <FaArrowUp />, color: 'cyan', desc: 'so với tháng trước' },
        { label: 'Tăng trưởng đơn hàng', value: '-2%', icon: <FaArrowDown />, color: 'red', desc: 'so với tháng trước' },
        { label: 'Tổng điểm đánh giá', value: 950, icon: <FaStar />, color: 'yellow', desc: 'từ người dùng' },
    ];

    // Mock người dùng hoạt động gần đây
    const recentCustomers = [
        { name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', orders: 5, spent: '2.5M', lastOrder: '2 ngày trước' },
        { name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0907654321', orders: 2, spent: '1.2M', lastOrder: '1 tuần trước' },
        { name: 'Lê Văn C', email: 'levanc@email.com', phone: '0912345678', orders: 8, spent: '4.8M', lastOrder: '3 ngày trước' },
        { name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0934567890', orders: 3, spent: '1.8M', lastOrder: 'Hôm qua' },
    ];

    // Xử lý form chỉnh sửa thông tin cá nhân
    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setAdmin(profileForm);
        setShowProfileModal(false);
    };

    return (
        <div className="py-3 px-4">
            {/* Phần chào mừng admin */}
            <div className="flex items-center mb-4 p-4 rounded-2xl shadow-sm bg-gradient-to-r from-blue-50 to-gray-50 min-h-[110px]">
                <div className="mr-3 relative cursor-pointer" onClick={() => { setProfileForm(admin); setShowProfileModal(true); }}>
                    <FaUserCircle className="text-blue-600" size={64} />
                    <span className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-blue-400 text-white text-xs font-medium px-2 py-1 rounded-full cursor-pointer">Sửa</span>
                </div>
                <div>
                    <h2 className="font-bold text-xl text-blue-600 mb-1">Chào mừng trở lại, {admin.name}!</h2>
                    <div className="text-gray-500">
                        <span className="font-semibold text-blue-600">FoodOrder Dashboard</span> - {admin.email}
                    </div>
                </div>
            </div>
            {/* Thông tin tổng quan bổ sung */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {growthStats.map((item) => (
                    <div key={item.label} className="bg-white shadow-sm rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                        <div className={`bg-${item.color}-100 text-${item.color}-600 rounded-full flex items-center justify-center w-11 h-11 text-xl`}>
                            {item.icon}
                        </div>
                        <div>
                            <div className="font-bold text-base">{item.value}</div>
                            <div className="text-sm text-gray-600">{item.label}</div>
                            <div className="text-xs text-gray-400">{item.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Các chỉ số chính */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {stats.map((item) => (
                    <div key={item.label} className="bg-white shadow-sm rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                        <div className={`bg-${item.color}-100 text-${item.color}-600 rounded-full flex items-center justify-center w-12 h-12 text-2xl`} title={item.label}>
                            {item.icon}
                        </div>
                        <div>
                            <div className="font-bold text-2xl" title={item.label}>{item.value}</div>
                            <div className="text-gray-600">{item.label}</div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Thống kê biểu đồ demo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-sm rounded-2xl mb-4">
                        <div className="flex items-center p-4 border-b-0 rounded-t-2xl">
                            <span className="font-semibold text-lg">Biểu đồ doanh thu 6 tháng gần nhất</span>
                            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full ml-2">Demo</span>
                        </div>
                        <div className="p-4">
                            <Line data={revenueData} options={{ responsive: true, plugins: { legend: { display: false }, tooltip: { enabled: true } } }} height={120} />
                        </div>
                    </div>
                    <div className="bg-white shadow-sm rounded-2xl">
                        <div className="p-4 font-semibold text-lg border-b-0 rounded-t-2xl">Top món ăn nổi bật</div>
                        <div className="p-0">
                            <table className="w-full table-auto">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-blue-600 px-4 py-2 text-left">Tên món ăn</th>
                                        <th className="text-blue-600 px-4 py-2 text-left">Lượt đặt</th>
                                        <th className="text-blue-600 px-4 py-2 text-left">Đánh giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topFoods.map((food, idx) => (
                                        <tr key={food.name} className={idx === 0 ? 'bg-blue-50' : 'hover:bg-blue-50'}>
                                            <td className="px-4 py-2">
                                                <span className="flex items-center">
                                                    <FaHamburger className="mr-2 text-blue-600" />
                                                    <span className="font-semibold">{food.name}</span>
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 font-semibold">{food.orders}</td>
                                            <td className="px-4 py-2">
                                                <FaStar className="text-yellow-400" /> <span className="font-semibold">{food.rating}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Biểu đồ tổng quan danh mục món ăn */}
                    <div className="bg-white shadow-sm rounded-2xl mt-4">
                        <div className="p-4 font-semibold text-lg border-b-0 rounded-t-2xl">Tổng quan danh mục món ăn</div>
                        <div className="p-4 flex flex-col items-center">
                            <div className="w-full max-w-[260px]">
                                <Pie data={foodCategoryData} options={{
                                    plugins: {
                                        legend: { display: true, position: 'bottom' },
                                        tooltip: { enabled: true }
                                    }
                                }} />
                            </div>
                            <ul className="mt-3 mb-0 w-full list-none">
                                {foodCategoryData.labels.map((label, idx) => (
                                    <li key={label} className="flex items-center mb-1">
                                        <span className="w-3.5 h-3.5 rounded-sm mr-2 border border-gray-200" style={{ background: foodCategoryData.datasets[0].backgroundColor[idx] }}></span>
                                        <span className="flex-1">{label}</span>
                                        <span className="font-bold">{foodCategoryData.datasets[0].data[idx]}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="bg-white shadow-sm rounded-2xl mb-4">
                        <div className="p-4 font-semibold text-lg border-b-0 rounded-t-2xl">Hoạt động gần đây</div>
                        <div className="p-4">
                            <ul className="list-none mb-0">
                                {activities.map((act, idx) => (
                                    <li className="mb-3 flex items-center" key={idx}>
                                        <span className={`bg-${act.color}-600 text-white text-sm font-medium px-3 py-2 rounded-xl min-w-[70px] mr-2`}>{act.type}</span>
                                        <span>{act.text}</span>
                                        <span className="ml-auto text-gray-500 text-xs">{act.time}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* Tổng quan nhanh */}
                    <div className="bg-white shadow-sm rounded-2xl">
                        <div className="p-4 font-semibold text-lg border-b-0 rounded-t-2xl">Tổng quan nhanh</div>
                        <div className="p-4">
                            <ul className="divide-y divide-gray-200">
                                <li className="flex justify-between items-center py-2">
                                    <span>Tổng số món ăn</span>
                                    <span className="font-bold text-blue-600">{stats[0].value}</span>
                                </li>
                                <li className="flex justify-between items-center py-2">
                                    <span>Tổng người dùng</span>
                                    <span className="font-bold text-green-600">{stats[1].value}</span>
                                </li>
                                <li className="flex justify-between items-center py-2">
                                    <span>Tổng đơn hàng</span>
                                    <span className="font-bold text-yellow-600">{stats[2].value}</span>
                                </li>
                                <li className="flex justify-between items-center py-2">
                                    <span>Điểm đánh giá</span>
                                    <span className="font-bold text-cyan-600">{growthStats[3].value}</span>
                                </li>
                                <li className="flex justify-between items-center py-2">
                                    <span>Doanh thu (triệu)</span>
                                    <span className="font-bold text-red-600">{stats[4].value}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Bảng người dùng hoạt động gần đây */}
                    <div className="bg-white shadow-sm rounded-2xl mt-4">
                        <div className="p-4 font-semibold text-lg border-b-0 rounded-t-2xl">Người dùng hoạt động gần đây</div>
                        <div className="p-0">
                            <table className="w-full table-auto">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Tên</th>
                                        <th className="px-4 py-2 text-left">Email</th>
                                        <th className="px-4 py-2 text-left">Điện thoại</th>
                                        <th className="px-4 py-2 text-left">Đơn hàng</th>
                                        <th className="px-4 py-2 text-left">Chi tiêu</th>
                                        <th className="px-4 py-2 text-left">Lần đặt cuối</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentCustomers.map((c, idx) => (
                                        <tr key={c.email} className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-blue-100'}>
                                            <td className="px-4 py-2 font-semibold">{c.name}</td>
                                            <td className="px-4 py-2 text-sm">{c.email}</td>
                                            <td className="px-4 py-2 text-sm">{c.phone}</td>
                                            <td className="px-4 py-2">{c.orders}</td>
                                            <td className="px-4 py-2">{c.spent}</td>
                                            <td className="px-4 py-2 text-sm">{c.lastOrder}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal chỉnh sửa thông tin cá nhân */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md">
                        <form onSubmit={handleProfileSubmit}>
                            <div className="flex justify-between items-center p-4 border-b">
                                <h5 className="text-lg font-semibold">Chỉnh sửa thông tin cá nhân</h5>
                                <button type="button" className="text-gray-500 hover:text-gray-700" onClick={() => setShowProfileModal(false)}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Tên</label>
                                    <input type="text" className="w-full border-gray-300 rounded-md p-2" name="name" value={profileForm.name} onChange={handleProfileChange} />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input type="email" className="w-full border-gray-300 rounded-md p-2" name="email" value={profileForm.email} onChange={handleProfileChange} />
                                </div>
                            </div>
                            <div className="flex justify-end p-4 border-t">
                                <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300" onClick={() => setShowProfileModal(false)}>Hủy</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;