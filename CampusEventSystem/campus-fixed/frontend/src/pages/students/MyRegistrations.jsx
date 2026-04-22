/* eslint-disable */
import { useState } from 'react'
import { Calendar, MapPin, Ticket, CheckCircle2, Clock, RefreshCw } from 'lucide-react'
import { useRegistrations } from '../../context/RegistrationContext'

const TABS = ['All', 'Upcoming', 'Past']

export default function MyRegistrations() {
  const { registrations, loading, error, refresh } = useRegistrations()
  const [activeTab, setActiveTab] = useState('All')

  // ── Date helpers ──────────────────────────────────────────
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const isUpcoming = (reg) => {
    const eventDate = reg.eventId?.date
    if (!eventDate) return true
    // Parse "YYYY-MM-DD" or full ISO strings safely
    const d = new Date(eventDate)
    return d >= todayStart
  }

  const filtered = registrations.filter(r => {
    if (activeTab === 'Upcoming') return isUpcoming(r)
    if (activeTab === 'Past')     return !isUpcoming(r)
    return true
  })

  const summary = {
    total:    registrations.length,
    upcoming: registrations.filter(isUpcoming).length,
    attended: registrations.filter(r => !isUpcoming(r)).length,
  }

  const formatDate = (d) => {
    if (!d) return 'TBD'
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  return (
    <div className="max-w-screen-xl mx-auto space-y-6 p-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">My Registrations</h1>
          <p className="text-sm text-gray-400 mt-1">Track all your event registrations</p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error} —{' '}
          <button onClick={refresh} className="underline font-medium">Try again</button>
        </div>
      )}

      {/* Not-logged-in guard */}
      {!loading && !error && registrations.length === 0 && (() => {
        const u = JSON.parse(localStorage.getItem('user') || '{}')
        if (!u._id && !u.id) {
          return (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm px-4 py-3 rounded-xl">
              You need to be logged in to see your registrations.
            </div>
          )
        }
        return null
      })()}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Registered', value: summary.total,    icon: Ticket,       color: 'text-blue-500 bg-blue-50'     },
          { label: 'Upcoming',         value: summary.upcoming, icon: Clock,        color: 'text-amber-500 bg-amber-50'   },
          { label: 'Past Events',      value: summary.attended, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50'},
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white shadow rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.split(' ')[1]}`}>
              <Icon size={18} className={color.split(' ')[0]} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white shadow rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-150
              ${activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <span>Event</span>
          <span>Date</span>
          <span>Venue</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="animate-spin mx-auto mb-3 w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full" />
            <p className="text-sm">Loading your registrations…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Ticket size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No registrations found</p>
            <p className="text-sm mt-1">
              {activeTab !== 'All'
                ? `No ${activeTab.toLowerCase()} events`
                : 'Browse events to get started!'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {filtered.map(reg => {
              const event    = reg.eventId || {}
              const upcoming = isUpcoming(reg)
              return (
                <li
                  key={reg._id}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Event name */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {(event.title || 'E').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {event.title || 'Unknown Event'}
                      </p>
                      {event.category && (
                        <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {event.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={11} className="text-gray-400 shrink-0" />
                    {formatDate(event.date)}
                  </div>

                  {/* Venue */}
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    {event.venue ? (
                      <>
                        <MapPin size={11} className="text-gray-400 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </div>

                  {/* Status badge */}
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full w-fit
                    ${upcoming
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                    }`}>
                    {upcoming ? '🗓 Upcoming' : '✅ Attended'}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
