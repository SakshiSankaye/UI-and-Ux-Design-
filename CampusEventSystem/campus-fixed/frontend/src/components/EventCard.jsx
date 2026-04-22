import { Calendar, MapPin, Users } from 'lucide-react'

export default function EventCard({ event }) {
  const { title, date, location, attendees, tag, image, tagColor } = event

  const tagColors = {
    Tech:      'bg-brand-100 text-brand-700',
    Workshop:  'bg-violet-100 text-violet-700',
    Music:     'bg-pink-100 text-pink-700',
    Design:    'bg-amber-100 text-amber-700',
    Career:    'bg-emerald-100 text-emerald-700',
  }

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 group">
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${tagColors[tag] ?? 'bg-gray-100 text-gray-600'}`}>
          {tag}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-display font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-3">
          {title}
        </h3>
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar size={12} strokeWidth={2} />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin size={12} strokeWidth={2} />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Users size={12} strokeWidth={2} />
            <span>{attendees} registered</span>
          </div>
        </div>
        <button className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-xs font-semibold py-2 rounded-xl transition-colors duration-150">
          Register Now
        </button>
      </div>
    </div>
  )
}
