import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, CalendarDays, LogOut, Zap } from "lucide-react";

const NAV = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard"     },
    { to: "/admin/users",     icon: Users,            label: "Manage Users"  },
    { to: "/admin/events",    icon: CalendarDays,     label: "Events"        },
];

function AdminSidebar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col shrink-0">
            {/* Brand */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <Zap size={15} className="text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-sm text-white">Admin Panel</h2>
                    <p className="text-[10px] text-gray-400">Campus Events</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors
                             ${isActive
                                ? "bg-blue-600 text-white font-semibold"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                             }`
                        }
                    >
                        <Icon size={16} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="px-3 py-4 border-t border-gray-700 space-y-2">
                <div className="px-3 py-2 text-xs text-gray-400 truncate">
                    {user.name || "Admin"} · <span className="text-blue-400">Admin</span>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-gray-800 transition-colors"
                >
                    <LogOut size={14} /> Sign out
                </button>
            </div>
        </div>
    );
}

export default AdminSidebar;
