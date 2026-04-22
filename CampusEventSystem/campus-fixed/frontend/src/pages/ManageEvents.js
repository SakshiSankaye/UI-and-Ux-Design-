/* eslint-disable */
import { useEffect, useState } from "react";
import { getEvents, getPendingEvents, approveEvent, rejectEvent, deleteEvent } from "../services/adminApi";
import { CheckCircle, XCircle, Trash2, Clock, Calendar, MapPin, Users, RefreshCw } from "lucide-react";

function ManageEvents() {
    const [events,    setEvents]    = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [filter,    setFilter]    = useState("all");      // all | pending | approved | rejected
    const [actionMsg, setActionMsg] = useState("");

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await getEvents();
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (msg) => {
        setActionMsg(msg);
        setTimeout(() => setActionMsg(""), 3000);
    };

    const handleApprove = async (id, title) => {
        const ok = await approveEvent(id);
        if (ok) {
            showMsg(`✅ "${title}" approved — now visible to students`);
            loadEvents();
        } else {
            showMsg("❌ Approve failed. Check backend.");
        }
    };

    const handleReject = async (id, title) => {
        const ok = await rejectEvent(id);
        if (ok) {
            showMsg(`🚫 "${title}" rejected`);
            loadEvents();
        } else {
            showMsg("❌ Reject failed.");
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
        const ok = await deleteEvent(id);
        if (ok) {
            showMsg(`🗑️ "${title}" deleted`);
            loadEvents();
        } else {
            showMsg("❌ Delete failed.");
        }
    };

    const filtered = events.filter(e => {
        if (filter === "all")      return true;
        if (filter === "pending")  return e.status === "pending";
        if (filter === "approved") return e.status === "approved";
        if (filter === "rejected") return e.status === "rejected";
        return true;
    });

    const counts = {
        all:      events.length,
        pending:  events.filter(e => e.status === "pending").length,
        approved: events.filter(e => e.status === "approved").length,
        rejected: events.filter(e => e.status === "rejected").length,
    };

    const STATUS_STYLE = {
        pending:  "bg-amber-100 text-amber-700 border-amber-200",
        approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
        rejected: "bg-red-100 text-red-700 border-red-200",
    };

    const TAB_STYLE = (t) =>
        `px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2
         ${filter === t ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"}`;

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Approve or reject events submitted by organizers
                    </p>
                </div>
                <button
                    onClick={loadEvents}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium"
                >
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {/* Action feedback banner */}
            {actionMsg && (
                <div className={`px-5 py-3 rounded-xl font-medium text-sm
                    ${actionMsg.startsWith("✅") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      actionMsg.startsWith("❌") ? "bg-red-50 text-red-600 border border-red-200" :
                      "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                    {actionMsg}
                </div>
            )}

            {/* Pending alert banner */}
            {counts.pending > 0 && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-5 py-4 rounded-2xl">
                    <Clock size={20} className="text-amber-500 shrink-0" />
                    <div>
                        <p className="font-semibold text-amber-800">
                            {counts.pending} event{counts.pending > 1 ? "s" : ""} waiting for approval
                        </p>
                        <p className="text-sm text-amber-600">
                            Review and approve to make them visible to students
                        </p>
                    </div>
                    <button onClick={() => setFilter("pending")}
                        className="ml-auto shrink-0 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors">
                        Review Now
                    </button>
                </div>
            )}

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {[
                    { key: "all",      label: "All Events"     },
                    { key: "pending",  label: "⏳ Pending"     },
                    { key: "approved", label: "✅ Approved"    },
                    { key: "rejected", label: "❌ Rejected"    },
                ].map(({ key, label }) => (
                    <button key={key} onClick={() => setFilter(key)} className={TAB_STYLE(key)}>
                        {label}
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full
                            ${filter === key ? "bg-white/30 text-white" : "bg-gray-100 text-gray-600"}`}>
                            {counts[key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Events list */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">
                    <RefreshCw size={32} className="mx-auto mb-3 animate-spin opacity-40" />
                    <p>Loading events…</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <p className="text-gray-400 font-semibold">No events found</p>
                    {filter === "pending" && (
                        <p className="text-xs text-gray-400 mt-1">
                            No pending events — organizers haven't submitted any yet
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((event) => (
                        <div
                            key={event._id}
                            className={`bg-white rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-all
                                ${event.status === "pending" ? "border-amber-200 bg-amber-50/30" : "border-gray-100"}`}
                        >
                            {/* Event info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h3 className="font-bold text-gray-900 text-base">{event.title}</h3>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${STATUS_STYLE[event.status] || STATUS_STYLE.pending}`}>
                                        {event.status?.toUpperCase()}
                                    </span>
                                </div>

                                {event.description && (
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">{event.description}</p>
                                )}

                                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                    {event.date && (
                                        <span className="flex items-center gap-1">
                                            <Calendar size={11} />
                                            {event.date} {event.time && `· ${event.time}`}
                                        </span>
                                    )}
                                    {event.venue && (
                                        <span className="flex items-center gap-1">
                                            <MapPin size={11} />
                                            {event.venue}
                                        </span>
                                    )}
                                    {event.category && (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                            {event.category}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Users size={11} />
                                        {event.participants?.length || 0} registered
                                    </span>
                                    {event.organizerName && (
                                        <span className="text-gray-400">
                                            By: {event.organizerName}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                {event.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(event._id, event.title)}
                                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                                        >
                                            <CheckCircle size={15} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(event._id, event.title)}
                                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                                        >
                                            <XCircle size={15} />
                                            Reject
                                        </button>
                                    </>
                                )}

                                {event.status === "rejected" && (
                                    <button
                                        onClick={() => handleApprove(event._id, event.title)}
                                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                                    >
                                        <CheckCircle size={15} />
                                        Approve
                                    </button>
                                )}

                                {event.status === "approved" && (
                                    <button
                                        onClick={() => handleReject(event._id, event.title)}
                                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                                    >
                                        <XCircle size={15} />
                                        Revoke
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(event._id, event.title)}
                                    className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors border border-gray-200"
                                    title="Delete event"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageEvents;
