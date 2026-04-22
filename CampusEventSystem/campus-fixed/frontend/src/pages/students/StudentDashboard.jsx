/* eslint-disable */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays, BookMarked, Bell, LayoutGrid, Search,
  Clock, ArrowRight, Ticket, CheckCircle2, BookmarkPlus,
  AlertCircle, Sparkles, ChevronRight, Calendar, MapPin, Users, CheckCircle,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import API from "../../services/api";
import { useRegistrations } from "../../context/RegistrationContext";

const STAT_ICONS = [CalendarDays, BookMarked, Bell, LayoutGrid];

const QuickAction = ({ icon: Icon, label, sub, color, onClick }) => {
  const colors = {
    blue:   "from-blue-500 to-blue-600",
    violet: "from-violet-500 to-violet-600",
    green:  "from-emerald-500 to-emerald-600",
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 bg-gradient-to-br ${colors[color]} text-white rounded-2xl p-4 hover:opacity-90 active:scale-95 transition-all text-left w-full`}
    >
      <div className="bg-white/20 rounded-xl p-2.5"><Icon size={18} strokeWidth={2} /></div>
      <div>
        <p className="font-bold text-sm">{label}</p>
        <p className="text-xs text-white/70 mt-0.5">{sub}</p>
      </div>
      <ChevronRight size={16} className="ml-auto opacity-70" />
    </button>
  );
};

export default function StudentDashboard() {
  const navigate   = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName  = storedUser.name?.split(" ")[0] || "Student";

  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Real registration count from context
  const { registrations, isRegistered } = useRegistrations();

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        setLoading(true);
        const res = await API.get("/api/events/approved");
        setEvents(Array.isArray(res.data) ? res.data.slice(0, 4) : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApproved();
  }, []);

  const heroEvent = events[0] || null;

  const stats = [
    { id: 1, label: "Available Events",  value: events.length,          change: "Approved",  color: "brand"  },
    { id: 2, label: "Registered",        value: registrations.length,   change: "Active",    color: "green"  },
    { id: 3, label: "Notifications",     value: 0,                      change: "Unread",    color: "amber"  },
    { id: 4, label: "Total on Platform", value: events.length,          change: "All time",  color: "violet" },
  ];

  return (
    <div className="space-y-7 max-w-screen-xl mx-auto">

      {/* Welcome + Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={15} className="text-amber-400" />
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Good morning</span>
          </div>
          <h1 className="font-bold text-3xl text-gray-900 leading-tight">
            Welcome back,<br />
            <span className="text-blue-600">{firstName} 👋</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {registrations.length > 0
              ? <>You are registered for <span className="text-gray-700 font-semibold">{registrations.length} event{registrations.length > 1 ? 's' : ''}</span>.</>
              : events.length > 0
                ? <>There are <span className="text-gray-700 font-semibold">{events.length} approved events</span> waiting for you!</>
                : "No approved events yet — check back soon!"
            }
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => navigate("/student/browse")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Search size={14} /> Explore Events
            </button>
            <button
              onClick={() => navigate("/student/calendar")}
              className="flex items-center gap-2 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm border border-gray-200 transition-colors"
            >
              <CalendarDays size={14} /> Calendar
            </button>
          </div>
        </div>

        {/* Hero card */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-500 p-6 text-white shadow-lg min-h-[200px]">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute right-0 top-0 w-52 h-52 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Featured Event
            </span>
            {heroEvent ? (
              <>
                <h2 className="font-bold text-xl leading-snug max-w-xs">{heroEvent.title}</h2>
                {heroEvent.description && (
                  <p className="text-white/70 text-sm mt-1.5 max-w-sm line-clamp-2">{heroEvent.description}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/80">
                  {heroEvent.date  && <span className="flex items-center gap-1.5"><CalendarDays size={13}/>{heroEvent.date}</span>}
                  {heroEvent.venue && <span className="flex items-center gap-1.5"><Clock size={13}/>{heroEvent.venue}</span>}
                </div>
                <div className="mt-5">
                  <button
                    onClick={() => navigate(`/student/event/${heroEvent._id}`)}
                    className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    View Details <ArrowRight size={14} />
                  </button>
                </div>
              </>
            ) : (
              <div>
                <h2 className="font-bold text-xl">No Events Yet</h2>
                <p className="text-white/70 text-sm mt-1">Events will appear here once approved by admin.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={s.id} icon={STAT_ICONS[i]} label={s.label} value={s.value} change={s.change} color={s.color} />
        ))}
      </div>

      {/* Events Grid + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-lg">Upcoming Events</h2>
            <button
              onClick={() => navigate("/student/browse")}
              className="text-xs text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              View all <ArrowRight size={13} />
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">Loading events…</p>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
              <CalendarDays size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No approved events yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {events.map(event => (
                <MiniEventCard key={event._id} event={event} navigate={navigate} registered={isRegistered(event._id)} />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-5">
          <div>
            <h2 className="font-bold text-gray-900 text-lg mb-3">Quick Actions</h2>
            <div className="space-y-2.5">
              <QuickAction icon={Search}       label="Browse Events"    sub={`${events.length} events available`}                     color="blue"   onClick={() => navigate("/student/browse")} />
              <QuickAction icon={CalendarDays} label="View Calendar"    sub="Check your schedule"                                     color="violet" onClick={() => navigate("/student/calendar")} />
              <QuickAction icon={BookMarked}   label="My Registrations" sub={`${registrations.length} event${registrations.length !== 1 ? 's' : ''} registered`} color="green"  onClick={() => navigate("/student/registrations")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniEventCard({ event, navigate, registered }) {
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col
      ${registered ? 'border-emerald-200' : 'border-gray-100'}`}>
      <div className="relative h-36 overflow-hidden bg-gray-100">
        <img
          src={event.image || `https://picsum.photos/seed/${event._id}/400/200`}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = `https://picsum.photos/seed/${event._id}/400/200`; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {registered && (
          <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
            <CheckCircle size={9} /> Registered
          </span>
        )}
        {event.category && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            {event.category}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">{event.title}</h3>
        <div className="space-y-1 mb-3">
          {event.date  && <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10}/>{event.date}</p>}
          {event.venue && <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10}/>{event.venue}</p>}
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Users size={10}/>{event.participants?.length || 0} registered
          </p>
        </div>
        <button
          onClick={() => navigate(`/student/event/${event._id}`)}
          className={`mt-auto w-full text-xs font-bold py-2 rounded-xl transition-colors
            ${registered ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {registered ? '✓ View Details' : 'Register Now'}
        </button>
      </div>
    </div>
  );
}
