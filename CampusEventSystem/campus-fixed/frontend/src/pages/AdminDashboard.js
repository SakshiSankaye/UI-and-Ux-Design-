/* eslint-disable */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStats, getPendingEvents, approveEvent, rejectEvent } from "../services/adminApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Clock, CheckCircle, XCircle, Users, CalendarDays, ClipboardList, ArrowRight } from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats,   setStats]   = useState({ users: 0, events: 0, registrations: 0, pendingCount: 0 });
    const [pending, setPending] = useState([]);
    const [msg,     setMsg]     = useState("");

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        const [statsData, pendingData] = await Promise.all([
            getStats(),
            getPendingEvents()
        ]);
        setStats(statsData || { users: 0, events: 0, registrations: 0, pendingCount: 0 });
        setPending(Array.isArray(pendingData) ? pendingData : []);
    };

    const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

    const handleApprove = async (id, title) => {
        await approveEvent(id);
        flash(`✅ "${title}" approved — visible to students now`);
        loadAll();
    };

    const handleReject = async (id, title) => {
        await rejectEvent(id);
        flash(`🚫 "${title}" rejected`);
        loadAll();
    };

    const chartData = [
        { name: "Users",         value: stats.users         },
        { name: "Events",        value: stats.events        },
        { name: "Registrations", value: stats.registrations },
    ];

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto">

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-400 mt-1">System overview and event approvals</p>
            </div>

            {/* Flash message */}
            {msg && (
                <div className={`px-5 py-3 rounded-xl text-sm font-medium border
                    ${msg.startsWith("✅") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                    {msg}
                </div>
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                    { icon: Users,        label: "Total Users",   value: stats.users,         grad: "from-blue-500 to-indigo-600"   },
                    { icon: CalendarDays, label: "Total Events",  value: stats.events,        grad: "from-green-500 to-emerald-600" },
                    { icon: ClipboardList,label: "Registrations", value: stats.registrations, grad: "from-purple-500 to-pink-600"   },
                ].map(({ icon: Icon, label, value, grad }) => (
                    <div key={label} className={`bg-gradient-to-r ${grad} text-white p-6 rounded-2xl shadow-lg`}>
                        <div className="flex items-center gap-3 mb-1">
                            <Icon size={20} />
                            <h3 className="font-semibold">{label}</h3>
                        </div>
                        <p className="text-4xl font-bold mt-1">{value}</p>
                    </div>
                ))}
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <Clock size={18} className="text-amber-500" />
                        Pending Event Approvals
                        {pending.length > 0 && (
                            <span className="ml-1 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                {pending.length}
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={() => navigate("/admin/events")}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        View all events <ArrowRight size={14} />
                    </button>
                </div>

                {pending.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="font-semibold">No pending approvals</p>
                        <p className="text-xs mt-1">All events have been reviewed</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pending.map((event) => (
                            <div key={event._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900">{event.title}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        📅 {event.date}  {event.time && `· ${event.time}`}
                                        &nbsp;·&nbsp; 📍 {event.venue}
                                        {event.organizerName && ` · By: ${event.organizerName}`}
                                    </p>
                                    {event.description && (
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{event.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => handleApprove(event._id, event.title)}
                                        className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                                    >
                                        <CheckCircle size={14} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(event._id, event.title)}
                                        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                                    >
                                        <XCircle size={14} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-4">Analytics Overview</h2>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default AdminDashboard;
