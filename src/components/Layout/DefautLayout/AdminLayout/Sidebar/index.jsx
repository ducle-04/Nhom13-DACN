import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBox, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';

const menu = [
    { label: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin' },
    { label: 'Quản lý người dùng', icon: <FaUsers />, path: '/admin/user' },
    { label: 'Quản lý sản phẩm', icon: <FaBox />, path: '/admin/products' },
    { label: 'Quản lý đơn hàng', icon: <FaShoppingCart />, path: '/admin/orders' },
];

function Sidebar() {
    const location = useLocation();
    return (
        <aside className="admin-sidebar bg-gray-900 text-white h-screen flex flex-col p-0" style={{ width: 320 }}>
            <div className="sidebar-logo flex items-center justify-center py-4 border-b border-gray-700">
                <span className="logo-text font-bold text-xl text-blue-400">FooiebHub Admin</span>
            </div>
            <nav className="sidebar-menu flex-grow">
                <ul className="flex flex-col mt-3">
                    {menu.map(item => (
                        <li className="nav-item" key={item.path}>
                            <Link
                                to={item.path}
                                className={`nav-link flex items-center px-4 py-2 ${location.pathname.startsWith(item.path) ? 'bg-blue-600 text-white' : 'text-gray-300'}`}
                                style={{ fontWeight: 500, fontSize: 16 }}
                            >
                                <span className="sidebar-icon mr-2" style={{ fontSize: 18 }}>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-bottom border-t border-gray-700 py-3 px-4">
                <Link to="/logout" className="nav-link flex items-center text-red-400 font-bold">
                    <span className="sidebar-icon mr-2"><FaSignOutAlt /></span>
                    <span>Đăng xuất</span>
                </Link>
            </div>
        </aside>
    );
}

export default Sidebar;