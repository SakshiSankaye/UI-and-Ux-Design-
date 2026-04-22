import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, PlusCircle, CalendarDays, Users,
    ClipboardList, LogOut, Zap
} from "lucide-react";

const NAV = [
    { to: "/organizer/dashboard",     icon: LayoutDashboard, label: "Dashboard"     },
    { to: "/organizer/create-event",  icon: PlusCircle,      label: "Create Event"  },
    { to: "/organizer/manage-events", icon: CalendarDays,    label: "Manage Events" },
    { to: "/organizer/participants",  icon: Users,           label: "Participants"  },
    { to: "/organizer/attendance",    icon: ClipboardList,   label: "Attendance"    },
];

function OrganizerLayout() {
    const navigate = useNavigate();
    const user     = JSON.parse(localStorage.getItem("user") || "{}");

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <aside className="w-60 bg-gray-900 text-white flex flex-col shrink-0">
                {/* Brand */}
                <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-700">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Zap size={14} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-sm text-white">EVENT HUB</h2>
                        <p className="text-[10px] text-gray-400">Organizer Panel</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
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
                        {user.name || "Organizer"} · <span className="text-blue-400">Organizer</span>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-gray-800 transition-colors"
                    >
                        <LogOut size={14} /> Sign out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}

export default OrganizerLayout;
