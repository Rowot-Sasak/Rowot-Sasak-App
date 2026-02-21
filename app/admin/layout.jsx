'use client'

import Navbar from '../../components/ui/navbar';
import Sidebar from '../../components/ui/sidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="drawer lg:drawer-open font-sans">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col bg-base-200 min-h-screen">
                <Navbar />
                <main className="p-6">
                    {children}
                </main>
            </div>
            <Sidebar />
        </div>
    );
};

export default AdminLayout;