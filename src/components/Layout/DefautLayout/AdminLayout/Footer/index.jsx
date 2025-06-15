import React from 'react';

function Footer() {
    return (
        <footer className="admin-footer bg-gray-100 border-t text-center py-3 mt-auto" style={{ fontSize: 15 }}>
            <span className="text-gray-500">
                © {new Date().getFullYear()} FoobHub Admin  |  Powered by <span className="text-blue-600 font-semibold">FoodHub Team</span>
            </span>
        </footer>
    );
}

export default Footer;