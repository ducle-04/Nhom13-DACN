import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

function AdminLayout({ children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile && !sidebarCollapsed) {
                setSidebarCollapsed(true);
            }
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [sidebarCollapsed]);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="admin-layout flex min-h-screen">
            <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} onLogout={handleLogout} />
            <div className="admin-main flex-grow flex flex-col" style={{ minHeight: '100vh' }}>
                <Header onToggleSidebar={toggleSidebar} />
                <main
                    className="flex-grow p-3"
                    style={{
                        background: '#f8f9fa',
                        overflowY: 'auto',
                        minHeight: 0,
                        maxHeight: 'calc(100vh - 64px - 56px)'
                    }}
                >
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default AdminLayout;