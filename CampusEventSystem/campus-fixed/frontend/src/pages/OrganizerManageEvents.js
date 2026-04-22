/* eslint-disable */
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download, Eye, Pencil, Trash2, CalendarDays, RefreshCw } from "lucide-react";
import { getEvents, deleteEvent } from "../services/organizerApi";

// ✅ FIXED: No inline sidebar — OrganizerLayout provides it via Outlet
function OrganizerManageEvents() {
    const navigate = useNavigate();

    const [events,       setEvents]       = useState([]);
    const [searchTerm,   setSearchTerm]   = useState("");
    const [dateFilter,   setDateFilter]   = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading,      setLoading]      = useState(true);
    const [deleteModal,  setDeleteModal]  = useState(null);
    const [msg,          setMsg]          = useState("");

    const loadEvents = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getEvents();
            setEvents(Array.isArray(data) ? data : []);
        } catch { setEvents([]); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { loadEvents(); }, [loadEvents]);

    const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

    const getScheduleStatus = (dateValue) => {
        if (!dateValue) return "Upcoming";
        const a = new Date(dateValue); const b = new Date();
        a.setHours(0,0,0,0); b.setHours(0,0,0,0);
        if (a.getTime() === b.getTime()) return "Today";
        return a > b ? "Upcoming" : "Completed";
    };

    const filtered = useMemo(() => events.filter(e => {
        const q           = searchTerm.toLowerCase();
        const matchSearch = (e.title || "").toLowerCase().includes(q) || (e._id || "").includes(q);
        const matchDate   = !dateFilter || (e.date || "").slice(0, 10) === dateFilter;
        const matchStatus = statusFilter === "All" || e.status === statusFilter;
        return matchSearch && matchDate && matchStatus;
    }), [events, searchTerm, dateFilter, statusFilter]);

    const confirmDelete = async (id) => {
        await deleteEvent(id);
        flash("🗑️ Event deleted");
        setDeleteModal(null);
        loadEvents();
    };

    const handleExport = () => {
        if (!filtered.length) { alert("No events to export"); return; }
        const rows = [["ID","Title","Date","Approval","Schedule","Registrations"],
            ...filtered.map(e => [e._id, e.title, e.date, e.status, getScheduleStatus(e.date), e.participants?.length || 0])];
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" }));
        a.download = "my-events.csv"; a.click();
    };

    const APPROVAL_BADGE = {
        pending:  "bg-amber-100 text-amber-700",
        approved: "bg-emerald-100 text-emerald-700",
        rejected: "bg-red-100 text-red-700",
    };
    const SCHEDULE_BADGE = {
        Upcoming:  "bg-blue-100 text-blue-700",
        Today:     "bg-amber-100 text-amber-700",
        Completed: "bg-gray-100 text-gray-600",
    };

    const counts = { pending: events.filter(e => e.status === "pending").length };

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
                    <p className="text-sm text-gray-400 mt-1">Track status, registrations, and manage your events</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <Download size={14}/> Export CSV
                    </button>
                    <button onClick={() => navigate("/organizer/create-event")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
                        + New Event
                    </button>
                </div>
            </div>

            {/* Flash */}
            {msg && <div className="px-5 py-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium">{msg}</div>}

            {/* Pending notice */}
            {counts.pending > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800 font-medium">
                    ⏳ {counts.pending} event{counts.pending > 1 ? "s are" : " is"} waiting for admin approval
                </div>
            )}

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Events",   value: events.length },
                    { label: "Pending",        value: events.filter(e => e.status === "pending").length  },
                    { label: "Approved",       value: events.filter(e => e.status === "approved").length },
                    { label: "Registrations",  value: events.reduce((s, e) => s + (e.participants?.length || 0), 0) },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-[200px]">
                    <Search size={14} className="text-gray-400"/>
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by title or ID…"
                        className="bg-transparent text-sm outline-none w-full"/>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                    <CalendarDays size={14} className="text-gray-400"/>
                    <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
                        className="bg-transparent text-sm outline-none"/>
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none">
                    {["All","pending","approved","rejected"].map(s => <option key={s}>{s}</option>)}
                </select>
                <button onClick={loadEvents} className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50">
                    <RefreshCw size={15}/>
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading…</div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 text-center py-16 text-gray-400">
                    <p className="font-semibold">No events found</p>
                    <button onClick={() => navigate("/organizer/create-event")} className="mt-3 text-blue-600 text-sm hover:underline">
                        Create your first event →
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {/* Header row */}
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide">
                        <span>Event</span><span>Date</span><span>Approval</span><span>Registrations</span><span>Actions</span>
                    </div>
                    {filtered.map(e => (
                        <div key={e._id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <div>
                                <p className="font-semibold text-gray-900 text-sm truncate">{e.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{e.venue}</p>
                            </div>
                            <p className="text-xs text-gray-500">{e.date}</p>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit capitalize ${APPROVAL_BADGE[e.status || "pending"]}`}>
                                {e.status || "pending"}
                            </span>
                            <span className="text-sm font-semibold text-gray-700">
                                {e.participants?.length || 0}
                                {e.maxParticipants > 0 && <span className="text-gray-400 font-normal"> / {e.maxParticipants}</span>}
                            </span>
                            <div className="flex gap-1.5">
                                <button onClick={() => alert(`${e.title}\nDate: ${e.date}\nVenue: ${e.venue}\nParticipants: ${e.participants?.length || 0}`)}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700" title="View">
                                    <Eye size={15}/>
                                </button>
                                <button onClick={() => navigate(`/organizer/edit-event/${e._id}`)}
                                    className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600" title="Edit">
                                    <Pencil size={15}/>
                                </button>
                                <button onClick={() => setDeleteModal(e)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500" title="Delete">
                                    <Trash2 size={15}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
                        <div className="text-4xl mb-3">⚠️</div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Event?</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            "<strong>{deleteModal.title}</strong>" will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold">Cancel</button>
                            <button onClick={() => confirmDelete(deleteModal._id)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 text-sm font-semibold">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrganizerManageEvents;
