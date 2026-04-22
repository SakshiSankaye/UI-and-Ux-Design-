import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
    return (
        <div className="flex h-screen">
            <AdminSidebar />

            <div className="flex-1 p-4 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}