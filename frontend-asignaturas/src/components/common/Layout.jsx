import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <Header onToggleSidebar={handleToggleSidebar} />

            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 transition-all duration-300">
                    <div className="p-4 lg:p-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

// PropTypes
Layout.propTypes = {
    children: PropTypes.node.isRequired
};

export default Layout;