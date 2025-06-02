// src/components/Layout/DefautLayout/UserLayout.js
import Header from "../../components/Layout/DefautLayout/UserLayout/Header";

function UserLayout({ children }) {
    return (
        <div>
            <Header />
            <main>{children}</main>
        </div>
    );
}

export default UserLayout;