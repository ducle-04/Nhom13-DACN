import UserLayout from "../components/Layout/DefautLayout/UserLayout";
import Home from "./User/Home";
import About from "./User/About";
import Menu from "./User/Menu";
import Login from "./Login";
import News from "./User/News";


const PrivatePage = []; // Add private pages here if needed
const PublicPage = [
    { path: "/", component: Home, layout: UserLayout },
    { path: "/about", component: About, layout: UserLayout },
    { path: "/login", component: Login, layout: UserLayout },
    { path: "/menu", component: Menu, layout: UserLayout },
    { path: "/news", component: News, layout: UserLayout },
];
export { PublicPage, PrivatePage };