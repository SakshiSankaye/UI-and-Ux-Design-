/* eslint-disable */
import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Clock } from 'lucide-react'
import API from '../../services/api'
import { useRegistrations } from '../../context/RegistrationContext'

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function toYMD(d) {
  if (!d) return ''
  const s = typeof d === 'string' ? d : d.toISOString()
  return s.slice(0, 10)
}

export default function CalendarView() {
  const today = new Date()
  const [cur, setCur]     = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selected, setSel] = useState(null)
  const [events, setEvents]         = useState([])
  const [evLoading, setEvLoading]   = useState(true)

  // ✅ Use shared registration context — no extra fetch needed
  const { isRegistered, loading: regLoading } = useRegistrations()
  const loading = evLoading || regLoading

  // Load approved events once
  useEffect(() => {
    const load = async () => {
      setEvLoading(true)
      try {
        const evRes = await API.get('/api/events/approved')
        setEvents(Array.isArray(evRes.data) ? evRes.data : [])
      } catch (err) {
        console.error('Calendar load error:', err)
      } finally {
        setEvLoading(false)
      }
    }
    load()
  }, [])

  // ── Calendar helpers ─────────────────────────────────────
  const { year, month } = cur
  const daysInMonth  = new Date(year, month + 1, 0).getDate()
  const firstDay     = new Date(year, month, 1).getDay()

  const cells = useMemo(() => {
    const arr = []
    for (let i = 0; i < firstDay; i++) arr.push(null)
    for (let d = 1; d <= daysInMonth; d++) arr.push(d)
    while (arr.length % 7 !== 0) arr.push(null)
    return arr
  }, [year, month, firstDay, daysInMonth])

  const eventsForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return events.filter(e => toYMD(e.date) === dateStr)
  }

  const eventsThisMonth = useMemo(() =>
    events.filter(e => {
      const d = toYMD(e.date)
      return d.startsWith(`${year}-${String(month + 1).padStart(2,'0')}`)
    }).sort((a, b) => toYMD(a.date).localeCompare(toYMD(b.date)))
  , [events, year, month])

  const isToday = (d) =>
    d && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d

  const prev    = () => setCur(c => c.month === 0  ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 })
  const next    = () => setCur(c => c.month === 11 ? { year: c.year + 1, month: 0  } : { ...c, month: c.month + 1 })
  const goToday = () => { setCur({ year: today.getFullYear(), month: today.getMonth() }); setSel(today.getDate()) }

  const selectedEvents = selected ? eventsForDay(selected) : []

  return (
    <div className="max-w-screen-xl mx-auto space-y-6 p-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-400 mt-1">All campus events at a glance</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Registered
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="animate-spin mx-auto mb-3 w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full" />
          <p className="text-sm">Loading calendar…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-white shadow rounded-2xl p-6">

            {/* Month Nav */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-gray-900">{MONTHS[month]} {year}</h2>
              <div className="flex gap-2">
                <button onClick={prev} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={goToday} className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  Today
                </button>
                <button onClick={next} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wide text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                const dayEvents = day ? eventsForDay(day) : []
                const isTod     = isToday(day)
                const isSel     = selected === day && day

                return (
                  <div
                    key={idx}
                    onClick={() => day && setSel(isSel ? null : day)}
                    className={`relative rounded-xl p-1.5 min-h-[64px] transition-all duration-150
                      ${!day ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'}
                      ${isSel ? 'bg-blue-50 ring-2 ring-blue-300' : ''}
                    `}
                  >
                    {day && (
                      <>
                        <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold mx-auto mb-1
                          ${isTod ? 'bg-blue-600 text-white' : 'text-gray-700'}`}>
                          {day}
                        </span>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map(ev => {
                            // ✅ Use context isRegistered — consistent with rest of app
                            const reg = isRegistered(ev._id)
                            return (
                              <div key={ev._id}
                                className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md truncate
                                  ${reg
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-blue-100 text-blue-700'
                                  }`}
                              >
                                {ev.title}
                              </div>
                            )
                          })}
                          {dayEvents.length > 2 && (
                            <div className="text-[9px] text-gray-400 pl-1">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">

            {/* Selected day panel */}
            {selected && (
              <div className="bg-white shadow rounded-2xl p-5">
                <h3 className="font-bold text-base text-gray-900 mb-3">
                  {MONTHS[month]} {selected}, {year}
                </h3>
                {selectedEvents.length === 0 ? (
                  <p className="text-xs text-gray-400">No events on this day</p>
                ) : (
                  <ul className="space-y-2.5">
                    {selectedEvents.map(ev => {
                      const reg = isRegistered(ev._id)
                      return (
                        <li key={ev._id} className={`border rounded-xl px-3 py-2.5
                          ${reg ? 'border-emerald-200 bg-emerald-50' : 'border-blue-200 bg-blue-50'}`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0
                              ${reg ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                            <div>
                              <p className="text-xs font-semibold text-gray-800">{ev.title}</p>
                              {ev.time && (
                                <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                  <Clock size={9} /> {ev.time}
                                </p>
                              )}
                              {ev.venue && (
                                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                  <MapPin size={9} /> {ev.venue}
                                </p>
                              )}
                              {reg && (
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                                  ✓ Registered
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}

            {/* This month's events */}
            <div className="bg-white shadow rounded-2xl p-5">
              <h3 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
                <CalendarDays size={16} className="text-blue-500" />
                {MONTHS[month]} Events
                <span className="ml-auto text-xs font-normal text-gray-400">{eventsThisMonth.length} total</span>
              </h3>
              {eventsThisMonth.length === 0 ? (
                <p className="text-xs text-gray-400">No events this month</p>
              ) : (
                <ul className="space-y-2">
                  {eventsThisMonth.map(ev => {
                    const reg = isRegistered(ev._id)
                    const day = parseInt(toYMD(ev.date).split('-')[2])
                    return (
                      <li
                        key={ev._id}
                        onClick={() => setSel(day)}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl px-2 py-1.5 -mx-2 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
                          ${reg ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {day}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{ev.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{ev.venue || ev.time || ''}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full shrink-0 ${reg ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
