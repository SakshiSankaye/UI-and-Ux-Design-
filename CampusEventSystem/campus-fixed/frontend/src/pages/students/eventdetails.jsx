/* eslint-disable */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Tag, ExternalLink, CheckCircle } from "lucide-react";
import API from "../../services/api";
import { useRegistrations } from "../../context/RegistrationContext";

export default function EventDetails() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [event,   setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // ✅ Read registration state from context
  const { isRegistered } = useRegistrations();
  const alreadyRegistered = isRegistered(id);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
        setError("Event not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-24 text-gray-400">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        Loading event…
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-24 text-gray-400">
        <p className="font-semibold">{error || "Event not found"}</p>
        <button onClick={() => navigate("/student/browse")} className="mt-4 text-blue-600 hover:underline text-sm">
          ← Back to Browse
        </button>
      </div>
    );
  }

  const spotsLeft = event.maxParticipants > 0
    ? event.maxParticipants - (event.participants?.length || 0)
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate("/student/browse")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Browse
      </button>

      {/* Hero image */}
      <div className="rounded-2xl overflow-hidden h-56 bg-gray-100">
        <img
          src={event.image || `https://picsum.photos/seed/${id}/800/300`}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = `https://picsum.photos/seed/${id}/800/300`; }}
        />
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        {/* Title + Status */}
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">{event.title}</h1>
          {alreadyRegistered ? (
            <span className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle size={13} /> Registered
            </span>
          ) : (
            <span className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700">
              ✅ Open
            </span>
          )}
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            event.date     && { icon: Calendar,    text: `${event.date}${event.time ? ` · ${event.time}` : ""}` },
            event.venue    && { icon: MapPin,       text: event.venue },
            event.category && { icon: Tag,          text: event.category },
            true           && { icon: Users,        text: `${event.participants?.length || 0} registered${spotsLeft !== null ? ` · ${spotsLeft} spots left` : ""}` },
            event.deadline && { icon: Clock,        text: `Registration deadline: ${event.deadline}` },
            event.link     && { icon: ExternalLink, text: event.link, href: event.link },
          ].filter(Boolean).map(({ icon: Icon, text, href }, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <Icon size={15} className="text-gray-400 mt-0.5 shrink-0" />
              {href
                ? <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{text}</a>
                : <span>{text}</span>
              }
            </div>
          ))}
        </div>

        {/* Description */}
        {event.description && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-1.5">About this Event</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{event.description}</p>
          </div>
        )}

        {/* Tags */}
        {event.tags && (
          <div className="flex flex-wrap gap-2">
            {event.tags.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-3 pt-2">
          {alreadyRegistered ? (
            // ✅ Show "Registered" disabled button if already signed up
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 rounded-xl opacity-80 cursor-not-allowed"
            >
              <CheckCircle size={17} /> Already Registered
            </button>
          ) : (
            <button
              onClick={() => navigate(`/student/register/${id}`)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Register Now
            </button>
          )}
          <button
            onClick={() => navigate("/student/browse")}
            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
