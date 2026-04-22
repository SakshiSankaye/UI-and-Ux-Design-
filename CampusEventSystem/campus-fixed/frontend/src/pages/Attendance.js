/* eslint-disable */
import { useState, useEffect, useCallback } from "react"
import API from "../services/api"
import {
  MapPin, Users, Download, Plus, Link2, CheckCircle,
  Loader, AlertCircle, RefreshCw, Clock, QrCode
} from "lucide-react"

export default function Attendance() {
  const [events,       setEvents]       = useState([])
  const [selectedEvent, setSelectedEvent] = useState("")
  const [sessions,     setSessions]     = useState([])
  const [attendance,   setAttendance]   = useState([])
  const [creating,     setCreating]     = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [sessionLink,  setSessionLink]  = useState("")
  const [msg,          setMsg]          = useState({ type: "", text: "" })
  const [geoStatus,    setGeoStatus]    = useState("")

  const [sessionForm, setSessionForm] = useState({
    latitude: "", longitude: "", radius: "100"
  })

  // Load organizer's events
  useEffect(() => {
    API.get("/api/events/my-events").then(r => setEvents(Array.isArray(r.data) ? r.data : [])).catch(() => {})
  }, [])

  const loadAttendance = useCallback(async (eventId) => {
    if (!eventId) return
    setLoading(true)
    try {
      const [sessRes, attRes] = await Promise.all([
        API.get(`/api/attendance/sessions/${eventId}`),
        API.get(`/api/attendance/event/${eventId}`)
      ])
      setSessions(Array.isArray(sessRes.data) ? sessRes.data : [])
      setAttendance(Array.isArray(attRes.data) ? attRes.data : [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (selectedEvent) loadAttendance(selectedEvent)
    else { setSessions([]); setAttendance([]) }
  }, [selectedEvent, loadAttendance])

  const getMyLocation = () => {
    setGeoStatus("Detecting location…")
    navigator.geolocation.getCurrentPosition(
      pos => {
        setSessionForm(f => ({
          ...f,
          latitude:  pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }))
        setGeoStatus("✅ Location detected!")
        setTimeout(() => setGeoStatus(""), 3000)
      },
      err => setGeoStatus("❌ Location denied: " + err.message)
    )
  }

  const createSession = async () => {
    if (!selectedEvent)              { setMsg({ type:"error", text:"Select an event first" }); return }
    if (!sessionForm.latitude || !sessionForm.longitude)
                                     { setMsg({ type:"error", text:"Enter or detect your location" }); return }
    setCreating(true)
    setMsg({ type:"", text:"" })
    try {
      const res = await API.post("/api/attendance/session", {
        eventId:   selectedEvent,
        latitude:  parseFloat(sessionForm.latitude),
        longitude: parseFloat(sessionForm.longitude),
        radius:    parseFloat(sessionForm.radius) || 100,
      })
      setSessionLink(res.data.link)
      setMsg({ type:"success", text:"✅ Session created! Registered students have been notified." })
      loadAttendance(selectedEvent)
    } catch (err) {
      setMsg({ type:"error", text: err.response?.data?.message || "Failed to create session" })
    } finally { setCreating(false) }
  }

  const exportCSV = async () => {
    if (!selectedEvent) return
    try {
      const res = await API.get(`/api/attendance/export/${selectedEvent}`, { responseType: "blob" })
      const url = URL.createObjectURL(new Blob([res.data]))
      const a   = document.createElement("a")
      a.href = url; a.download = `attendance_${selectedEvent}.csv`; a.click()
    } catch { alert("Export failed") }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(sessionLink)
    setMsg({ type:"success", text:"Link copied to clipboard!" })
  }

  const selectedEventObj = events.find(e => e._id === selectedEvent)

  return (
    <div className="p-4 max-w-screen-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Geo Attendance</h2>
          <p className="text-sm text-gray-400 mt-1">Create location-based attendance sessions for your events</p>
        </div>
        {selectedEvent && attendance.length > 0 && (
          <button onClick={exportCSV}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Download size={15} /> Export CSV
          </button>
        )}
      </div>

      {msg.text && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm border
          ${msg.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
          {msg.type === "error" ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
          {msg.text}
        </div>
      )}

      {/* Event Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h3 className="font-bold text-gray-900">Select Event</h3>
        <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="">-- Choose an event --</option>
          {events.map(e => (
            <option key={e._id} value={e._id}>{e.title} ({e.date})</option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
          {/* Create Session */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Plus size={16} className="text-blue-600" /> Create Attendance Session
            </h3>
            <p className="text-xs text-gray-400">
              Share your current location as the event venue. Students must be within the set radius to mark attendance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Latitude</label>
                <input type="number" step="any" value={sessionForm.latitude}
                  onChange={e => setSessionForm(f => ({ ...f, latitude: e.target.value }))}
                  placeholder="e.g. 18.5204"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Longitude</label>
                <input type="number" step="any" value={sessionForm.longitude}
                  onChange={e => setSessionForm(f => ({ ...f, longitude: e.target.value }))}
                  placeholder="e.g. 73.8567"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Radius (m)</label>
                <input type="number" value={sessionForm.radius}
                  onChange={e => setSessionForm(f => ({ ...f, radius: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button onClick={getMyLocation}
                className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold px-4 py-2.5 rounded-xl transition-colors">
                <MapPin size={14} /> Use My Current Location
              </button>
              {geoStatus && <span className="text-xs text-gray-500">{geoStatus}</span>}
            </div>

            <button onClick={createSession} disabled={creating || !sessionForm.latitude || !sessionForm.longitude}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              {creating ? <Loader size={15} className="animate-spin" /> : <Link2 size={15} />}
              Generate Attendance Link
            </button>

            {sessionLink && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Attendance Link</p>
                <p className="text-sm text-blue-900 break-all font-mono bg-white rounded-lg px-3 py-2 border border-blue-100">
                  {sessionLink}
                </p>
                <button onClick={copyLink}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  <Link2 size={11} /> Copy Link
                </button>
                <p className="text-xs text-blue-500">Students have been notified. Share this link or paste it in chat.</p>
              </div>
            )}
          </div>

          {/* Attendance Records */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Users size={16} className="text-emerald-600" />
                Attendance Records
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-1">
                  {attendance.length}
                </span>
              </h3>
              <button onClick={() => loadAttendance(selectedEvent)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-400">
                <Loader size={22} className="animate-spin mx-auto mb-2" />
                <p className="text-sm">Loading attendance…</p>
              </div>
            ) : attendance.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Users size={28} className="mx-auto mb-2 opacity-30" />
                <p className="font-semibold text-sm">No attendance records yet</p>
                <p className="text-xs mt-1">Create a session and share the link with students</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">#</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Name</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Email</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Time</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {attendance.map((rec, i) => (
                      <tr key={rec._id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 text-gray-400 text-xs">{i + 1}</td>
                        <td className="py-3 pr-4 font-semibold text-gray-900">{rec.userId?.name || "—"}</td>
                        <td className="py-3 pr-4 text-gray-500 text-xs">{rec.userId?.email || "—"}</td>
                        <td className="py-3 pr-4 text-gray-500 text-xs flex items-center gap-1">
                          <Clock size={10} /> {new Date(rec.timestamp).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3">
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full w-fit">
                            <CheckCircle size={10} /> Present
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
