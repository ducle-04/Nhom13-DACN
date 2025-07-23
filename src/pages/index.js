import UserLayout from "../components/Layout/DefautLayout/UserLayout";
import Home from "./User/Home";
import About from "./User/About";
import Menu from "./User/Menu";
import Login from "./Login";
import Profile from "./User/Profile";
import News from "./User/News";
import Register from "./User/Register";
import Booking from "./User/BookingPage";
import BookingHistory from "./User/BookingHistory"
import OrderPage from "./User/OrderPage"
import OrderHistoryPage from "./User/OrderHistoryPage";
import AdminLayout from "../components/Layout/DefautLayout/AdminLayout";

import AdminDashboard from "./Admin/Dashboard";
import UserManager from "./Admin/UserManager";
import ProductManager from "./Admin/ProductManager";
import ProductTypeManager from "./Admin/ProductTypeManager";
import CategoryManager from "./Admin/CategoryManager";
import NewsManager from "./Admin/NewsManager";
import AdminBookingManagement from "./Admin/AdminBookingManagement";
import AdminOrderManagement from "./Admin/AdminOrderManagement";
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