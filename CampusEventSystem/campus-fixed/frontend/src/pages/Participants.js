/* eslint-disable */
import { useEffect, useState, useMemo } from "react";
import { Search, Users, ChevronDown, ChevronUp, RefreshCw, FileText, FileSpreadsheet } from "lucide-react";
import API from "../services/api";

function Participants() {
  const [events,      setEvents]      = useState([]);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [loading,     setLoading]     = useState(true);
  const [expanded,    setExpanded]    = useState({});
  const [partMap,     setPartMap]     = useState({});
  const [loadingPart, setLoadingPart] = useState({});
  const [exporting,   setExporting]   = useState({});

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/events");
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const toggleEvent = async (eventId) => {
    const isOpen = expanded[eventId];
    setExpanded(prev => ({ ...prev, [eventId]: !isOpen }));
    if (!isOpen && !partMap[eventId]) {
      setLoadingPart(prev => ({ ...prev, [eventId]: true }));
      try {
        const res = await API.get(`/api/registrations/event/${eventId}`);
        const data = Array.isArray(res.data) ? res.data : [];
        const participants = data.map(r => ({
          id:    r._id,
          name:  r.name  || r.studentId?.name  || "Unknown",
          email: r.email || r.studentId?.email || "—",
          phone: r.phone || "—",
          department: r.department || "—",
          registeredAt: r.createdAt,
        }));
        setPartMap(prev => ({ ...prev, [eventId]: participants }));
      } catch {
        const event = events.find(e => e._id === eventId);
        const participants = (event?.participants || []).map((p, i) => ({
          id:    `${eventId}-${i}`,
          name:  p.name  || "Unknown",
          email: p.email || "—",
          phone: "—",
          department: "—",
          registeredAt: null,
        }));
        setPartMap(prev => ({ ...prev, [eventId]: participants }));
      } finally {
        setLoadingPart(prev => ({ ...prev, [eventId]: false }));
      }
    }
  };

  const handleExport = async (eventId, format) => {
    const key = `${eventId}-${format}`;
    setExporting(prev => ({ ...prev, [key]: true }));
    try {
      const token = localStorage.getItem("token");
      const url   = `http://localhost:5000/api/registrations/export/${format}/${eventId}`;
      const res   = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href  = URL.createObjectURL(blob);
      link.download = `participants-${eventId}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      alert("Export failed. Make sure the backend is running.");
    } finally {
      setExporting(prev => ({ ...prev, [key]: false }));
    }
  };

  const filteredEvents = useMemo(() =>
    events.filter(e =>
      (e.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    ), [events, searchTerm]
  );

  const totalParticipants = events.reduce(
    (sum, e) => sum + (e.participants?.length || 0), 0
  );

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN") : "—";

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participants</h1>
          <p className="text-sm text-gray-400 mt-1">View and export participants per event</p>
        </div>
        <button onClick={loadEvents} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Events",       value: events.length },
          { label: "Approved Events",    value: events.filter(e => e.status === "approved").length },
          { label: "Total Participants", value: totalParticipants },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-3">
        <Search size={16} className="text-gray-400" />
        <input
          className="flex-1 text-sm outline-none"
          placeholder="Search events by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Events List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <div className="animate-spin mx-auto mb-3 w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full" />
          <p className="text-sm">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-2xl shadow">
          <Users size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No events found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map(event => (
            <div key={event._id} className="bg-white rounded-2xl shadow overflow-hidden">

              {/* Event Row */}
              <div className="flex items-center justify-between px-6 py-4">
                <button
                  className="flex items-center gap-4 flex-1 text-left"
                  onClick={() => toggleEvent(event._id)}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {(event.title || "E").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-400">{event.venue || "No venue"} · {formatDate(event.date)}</p>
                  </div>
                </button>

                <div className="flex items-center gap-2 ml-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full
                    ${event.status === "approved"  ? "bg-emerald-100 text-emerald-700" :
                      event.status === "pending"   ? "bg-amber-100 text-amber-700"    :
                                                     "bg-red-100 text-red-700"}`}>
                    {event.status}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                    {event.participants?.length || 0} registered
                  </span>

                  {/* Export Buttons */}
                  <button
                    onClick={() => handleExport(event._id, 'pdf')}
                    disabled={exporting[`${event._id}-pdf`]}
                    title="Download PDF"
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    <FileText size={13} />
                    {exporting[`${event._id}-pdf`] ? '...' : 'PDF'}
                  </button>
                  <button
                    onClick={() => handleExport(event._id, 'excel')}
                    disabled={exporting[`${event._id}-excel`]}
                    title="Download Excel"
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    <FileSpreadsheet size={13} />
                    {exporting[`${event._id}-excel`] ? '...' : 'Excel'}
                  </button>

                  <button onClick={() => toggleEvent(event._id)} className="p-1 text-gray-400">
                    {expanded[event._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Participants Table */}
              {expanded[event._id] && (
                <div className="border-t border-gray-100">
                  {loadingPart[event._id] ? (
                    <div className="text-center py-6 text-gray-400 text-sm">Loading participants...</div>
                  ) : !partMap[event._id] || partMap[event._id].length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-sm">No participants registered yet</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {["#","Name","Email","Phone","Department","Registered On"].map(h => (
                            <th key={h} className="text-left px-4 py-2 text-xs text-gray-400 font-semibold uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {partMap[event._id].map((p, i) => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                            <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                            <td className="px-4 py-3 text-gray-500">{p.email}</td>
                            <td className="px-4 py-3 text-gray-400">{p.phone}</td>
                            <td className="px-4 py-3 text-gray-400">{p.department}</td>
                            <td className="px-4 py-3 text-gray-400">{formatDate(p.registeredAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Participants;
