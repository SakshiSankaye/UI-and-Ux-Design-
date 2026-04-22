/* eslint-disable */
import { Search, Calendar, MapPin, Users, X, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useRegistrations } from "../../context/RegistrationContext";

const CATEGORIES = ["All", "Technology", "Design", "Career", "Music", "Workshop"];

const CAT_COLORS = {
  Technology: "bg-blue-100 text-blue-700",
  Workshop:   "bg-violet-100 text-violet-700",
  Music:      "bg-pink-100 text-pink-700",
  Design:     "bg-amber-100 text-amber-700",
  Career:     "bg-emerald-100 text-emerald-700",
};

export default function BrowseEvents() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const PER_PAGE = 6;

  // ✅ Registration context for showing registered state on cards
  const { isRegistered } = useRegistrations();

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        setLoading(true);
        const res = await API.get("/api/events/approved");
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("BrowseEvents fetch error:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApproved();
  }, []);

  const filtered = events.filter(e => {
    const q           = search.toLowerCase();
    const matchSearch = (e.title || "").toLowerCase().includes(q) ||
                        (e.venue || "").toLowerCase().includes(q) ||
                        (e.description || "").toLowerCase().includes(q);
    const matchCat    = category === "All" || e.category === category;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="max-w-screen-xl mx-auto space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-gray-900">Discover Experiences</h1>
        <p className="text-sm text-gray-400 mt-1">Browse approved events happening on campus</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 min-w-[220px]">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search events, venues…"
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all
              ${category === cat
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-600">{filtered.length}</span> approved events
      </p>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
          Loading events…
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Search size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No events found</p>
          <p className="text-xs mt-1">
            {events.length === 0 ? "No approved events yet — check back soon!" : "Try a different search or category"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginated.map(event => (
            // ✅ Pass isRegistered down to each card
            <EventCard key={event._id} event={event} registered={isRegistered(event._id)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30">
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all
                ${p === page ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, registered }) {
  const navigate = useNavigate();
  const catColor = CAT_COLORS[event.category] || "bg-gray-100 text-gray-600";

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col
      ${registered ? "border-emerald-200" : "border-gray-100"}`}>
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={event.image || `https://picsum.photos/seed/${event._id}/400/200`}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = `https://picsum.photos/seed/${event._id}/400/200`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {event.category && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${catColor}`}>
            {event.category}
          </span>
        )}
        {/* ✅ Show "Registered" or "Open" badge */}
        {registered ? (
          <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white">
            <CheckCircle size={10} /> Registered
          </span>
        ) : (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
            Open
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{event.title}</h3>
        {event.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{event.description}</p>
        )}
        <div className="space-y-1 mb-4">
          {event.date  && <div className="flex items-center gap-1.5 text-xs text-gray-400"><Calendar size={11}/>{event.date} {event.time && `· ${event.time}`}</div>}
          {event.venue && <div className="flex items-center gap-1.5 text-xs text-gray-400"><MapPin size={11}/>{event.venue}</div>}
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Users size={11}/>{event.participants?.length || 0} registered
            {event.maxParticipants > 0 && ` · max ${event.maxParticipants}`}
          </div>
        </div>
        <button
          onClick={() => navigate(`/student/event/${event._id}`)}
          className={`mt-auto w-full text-xs font-bold py-2.5 rounded-xl transition-colors
            ${registered
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {registered ? "✓ View Details" : "View Details & Register"}
        </button>
      </div>
    </div>
  );
}
