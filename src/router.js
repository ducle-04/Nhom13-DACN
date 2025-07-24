import UserLayout from "./components/Layout/DefautLayout/UserLayout";
import Home from "./pages/User/Home";
import About from "./pages/User/About";
import Menu from "./pages/User/Menu";
import Login from "./pages/Login";
import Profile from "./pages/User/Profile";
import News from "./pages/User/News";
import Register from "./pages/User/Register";
import Booking from "./pages/User/BookingPage";
import BookingHistory from "./pages/User/BookingHistory"
import OrderPage from "./pages/User/OrderPage"
import OrderHistoryPage from "./pages/User/OrderHistoryPage";
import AdminLayout from "./components/Layout/DefautLayout/AdminLayout";

import AdminDashboard from "./pages/Admin/Dashboard";
import UserManager from "./pages/Admin/UserManager";
import ProductManager from "./pages/Admin/ProductManager";
import ProductTypeManager from "./pages/Admin/ProductTypeManager";
import CategoryManager from "./pages/Admin/CategoryManager";
import NewsManager from "./pages/Admin/NewsManager";
import AdminBookingManagement from "./pages/Admin/AdminBookingManagement";
import AdminOrderManagement from "./pages/Admin/AdminOrderManagement";
const PrivatePage = [

]; // Add private pages here if needed
const PublicPage = [
    { path: "/", component: Home, layout: UserLayout },
    { path: "/promotions", component: Home, layout: UserLayout },
    { path: "/about", component: About, layout: UserLayout },
    { path: "/login", component: Login, layout: null },
    { path: "/register", component: Register, layout: null },
    { path: "/menu", component: Menu, layout: UserLayout },
    { path: "/news", component: News, layout: UserLayout },
    { path: "/booking", component: Booking, layout: UserLayout },
    { path: "/booking/history", component: BookingHistory, layout: UserLayout },
    { path: "/orders", component: OrderPage, layout: UserLayout },
    { path: "/orders/history", component: OrderHistoryPage, layout: UserLayout },
    { path: "/profile", component: Profile, layout: UserLayout },
    { path: "/admin", component: AdminDashboard, layout: AdminLayout },
    { path: "/admin/user", component: UserManager, layout: AdminLayout },
    { path: "/admin/products", component: ProductManager, layout: AdminLayout },
    { path: "/admin/product-types", component: ProductTypeManager, layout: AdminLayout },
    { path: "/admin/categories", component: CategoryManager, layout: AdminLayout },
    { path: "/admin/news", component: NewsManager, layout: AdminLayout },
    { path: "/admin/bookings", component: AdminBookingManagement, layout: AdminLayout },
    { path: "/admin/orders", component: AdminOrderManagement, layout: AdminLayout },



];
const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};
export { PublicPage, PrivatePage };