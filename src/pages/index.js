import UserLayout from "../components/Layout/DefautLayout/UserLayout";
import Home from "./User/Home";
import About from "./User/About";
import { path } from "framer-motion/client";
import Login from "./Login";

const PrivatePage = []; // Add private pages here if needed
const PublicPage = [
    { path: "/", component: Home, layout: UserLayout },
    { path: "/about", component: About, layout: UserLayout },
    { path: "/login", component: Login, layout: UserLayout },

];
export { PublicPage, PrivatePage };