import UserLayout from "../components/Layout/DefautLayout/UserLayout";
import Home from "./User/Home";
import About from "./User/About";
import Menu from "./User/Menu";
import Login from "./Login";
import News from "./User/News";
import Register from "./User/Register";
import Booking from "./User/BookingPage";
import AdminLayout from "../components/Layout/DefautLayout/AdminLayout";

import AdminDashboard from "./Admin/Dashboard";
import UserManager from "./Admin/UserManager";
import ProductManager from "./Admin/ProductManager";

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

    { path: "/admin", component: AdminDashboard, layout: AdminLayout },
    { path: "/admin/user", component: UserManager, layout: AdminLayout },
    { path: "/admin/products", component: ProductManager, layout: AdminLayout },


];
const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};
export { PublicPage, PrivatePage };