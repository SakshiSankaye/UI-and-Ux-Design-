/* eslint-disable */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import {
    Bell, Ticket, Clock, AlertCircle, Sparkles, Info,
    Check, Trash2, CheckCheck, RefreshCw, MapPin,
} from "lucide-react";

const TYPE_META = {
    reminder:     { icon: Clock,         bg: "bg-amber-50",   iconColor: "text-amber-500",   label: "Reminder"      },
    registration: { icon: Ticket,        bg: "bg-blue-50",    iconColor: "text-blue-500",    label: "Registration"  },
    attendance:   { icon: MapPin,        bg: "bg-purple-50",  iconColor: "text-purple-500",  label: "Attendance"    },
    general:      { icon: Info,          bg: "bg-violet-50",  iconColor: "text-violet-500",  label: "General"       },
    new:          { icon: Sparkles,      bg: "bg-emerald-50", iconColor: "text-emerald-500", label: "New Event"     },
};

export default function Notifications() {
    const navigate = useNavigate();
    const [notifs,  setNotifs]  = useState([]);
    const [filter,  setFilter]  = useState("All");
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const res = await API.get("/api/notifications");
            setNotifs(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Notif fetch error:", err);
            setNotifs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    const unreadCount = notifs.filter(n => !n.read).length;

    const markAllRead = async () => {
        try {
            await API.put("/api/notifications/read-all");
            setNotifs(n => n.map(x => ({ ...x, read: true })));
        } catch (err) { console.error(err); }
    };

    const markRead = async (id) => {
        try {
            await API.put(`/api/notifications/${id}/read`);
            setNotifs(n => n.map(x => (x._id === id ? { ...x, read: true } : x)));
        } catch (err) { console.error(err); }
    };

    const remove = async (id) => {
        try {
            await API.delete(`/api/notifications/${id}`);
            setNotifs(n => n.filter(x => x._id !== id));
        } catch (err) { console.error(err); }
    };

    const filtered = notifs.filter(n => {
        if (filter === "Unread") return !n.read;
        if (filter === "Read")   return n.read;
        return true;
    });

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1)  return "just now";
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        return `${Math.floor(h / 24)}d ago`;
    };

    return (
        <div className="max-w-2xl mx-auto space-y-5 p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-2xl text-gray-900 flex items-center gap-2">
                        <Bell size={22} className="text-blue-600" />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="ml-1 text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">{notifs.length} total notifications</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchNotifications}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                        <RefreshCw size={15} />
                    </button>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead}
                            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-xl">
                            <CheckCheck size={14} /> Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 bg-white shadow-sm rounded-xl p-1 w-fit border border-gray-100">
                {["All", "Unread", "Read"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                            ${filter === f ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                        {f}
                        {f === "Unread" && unreadCount > 0 && (
                            <span className="ml-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">
                    <div className="animate-spin mx-auto mb-3 w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full" />
                    <p className="text-sm">Loading notifications…</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <Bell size={32} className="mx-auto mb-3 text-gray-200" />
                    <p className="font-semibold text-gray-500">No notifications</p>
                    <p className="text-sm text-gray-400 mt-1">
                        {filter !== "All" ? `No ${filter.toLowerCase()} notifications` : "You're all caught up!"}
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map(n => {
                        const meta = TYPE_META[n.type] || TYPE_META.general;
                        const Icon = meta.icon;
                        return (
                            <div
                                key={n._id}
                                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200
                                    ${n.read ? "bg-white border-gray-100" : "bg-blue-50/50 border-blue-100 shadow-sm"}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
                                    <Icon size={18} className={meta.iconColor} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className={`text-sm leading-snug ${n.read ? "text-gray-600" : "text-gray-900 font-semibold"}`}>
                                                {n.message}
                                            </p>
                                            {n.link && (
                                                <a
                                                    href={n.link}
                                                    target="_blank" rel="noreferrer"
                                                    className="inline-block mt-1 text-xs text-blue-600 hover:underline font-medium"
                                                >
                                                    Open Link →
                                                </a>
                                            )}
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.iconColor}`}>
                                                    {meta.label}
                                                </span>
                                                <span className="text-[10px] text-gray-400">{timeAgo(n.createdAt)}</span>
                                                {!n.read && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            {!n.read && (
                                                <button onClick={() => markRead(n._id)}
                                                    title="Mark as read"
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            <button onClick={() => remove(n._id)}
                                                title="Delete"
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
