/* eslint-disable */
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MapPin, CheckCircle, AlertCircle, Loader, CalendarDays, ArrowLeft } from "lucide-react"
import API from "../../services/api"

export default function AttendanceMark() {
  const { sessionId } = useParams()
  const navigate      = useNavigate()

  const [session,   setSession]  = useState(null)
  const [loading,   setLoading]  = useState(true)
  const [marking,   setMarking]  = useState(false)
  const [geoState,  setGeoState] = useState("idle") // idle | getting | done | error
  const [myLoc,     setMyLoc]    = useState(null)
  const [result,    setResult]   = useState(null)   // { type: "success"|"error", text: "" }
  const [geoErr,    setGeoErr]   = useState("")

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await API.get(`/api/attendance/session/${sessionId}`)
        setSession(res.data)
      } catch (err) {
        setResult({ type: "error", text: "Attendance session not found or has expired." })
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [sessionId])

  const getLocation = () => {
    if (!navigator.geolocation) {
      setGeoErr("Geolocation is not supported by your browser.")
      return
    }
    setGeoState("getting")
    setGeoErr("")
    navigator.geolocation.getCurrentPosition(
      pos => {
        setMyLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoState("done")
      },
      err => {
        setGeoErr("Could not get location: " + err.message + ". Please allow location access.")
        setGeoState("error")
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  const markAttendance = async () => {
    if (!myLoc) {
      getLocation()
      return
    }
    setMarking(true)
    setResult(null)
    try {
      const res = await API.post("/api/attendance/mark", {
        sessionId,
        latitude:  myLoc.lat,
        longitude: myLoc.lng,
      })
      setResult({ type: "success", text: res.data.message || "Attendance marked successfully!" })
    } catch (err) {
      setResult({ type: "error", text: err.response?.data?.message || "Failed to mark attendance." })
    } finally {
      setMarking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <Loader size={24} className="animate-spin mr-2" /> Loading session…
      </div>
    )
  }

  const alreadyMarked = result?.type === "success"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md p-6 space-y-5">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MapPin size={28} className="text-blue-600" />
          </div>
          <h1 className="font-bold text-2xl text-gray-900">Mark Attendance</h1>
          <p className="text-sm text-gray-400 mt-1">Verify your location to mark attendance</p>
        </div>

        {/* Session Info */}
        {session && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
            <p className="font-bold text-blue-900 text-sm">
              {session.eventId?.title || "Event"}
            </p>
            {session.eventId?.date && (
              <p className="text-xs text-blue-700 flex items-center gap-1">
                <CalendarDays size={11} /> {session.eventId.date}
                {session.eventId?.venue && ` · ${session.eventId.venue}`}
              </p>
            )}
            {session.eventId?.time && (
              <p className="text-xs text-blue-600">
                Time: {session.eventId.time}
                {session.eventId?.endTime ? ` – ${session.eventId.endTime}` : ""}
              </p>
            )}
            <p className="text-xs text-blue-600">
              Required radius: {session.radius}m from venue
            </p>
            {!session.active && (
              <p className="text-xs font-semibold text-red-600 mt-1">⚠ This session is closed</p>
            )}
          </div>
        )}

        {/* Result message */}
        {result && (
          <div className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm border
            ${result.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"}`}>
            {result.type === "success"
              ? <CheckCircle size={16} className="shrink-0 mt-0.5" />
              : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
            <span>{result.text}</span>
          </div>
        )}

        {/* Location status */}
        {myLoc && geoState === "done" && (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            <CheckCircle size={13} />
            Location detected: {myLoc.lat.toFixed(4)}, {myLoc.lng.toFixed(4)}
          </div>
        )}
        {geoErr && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {geoErr}
          </div>
        )}

        {/* Action buttons */}
        {!alreadyMarked && session?.active && (
          <>
            {geoState !== "done" ? (
              <button onClick={getLocation} disabled={geoState === "getting"}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                {geoState === "getting"
                  ? <><Loader size={15} className="animate-spin" /> Detecting location…</>
                  : <><MapPin size={15} /> Detect My Location</>}
              </button>
            ) : (
              <button onClick={markAttendance} disabled={marking}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                {marking
                  ? <><Loader size={15} className="animate-spin" /> Marking…</>
                  : <><CheckCircle size={15} /> Mark My Attendance</>}
              </button>
            )}
          </>
        )}

        {alreadyMarked && (
          <button onClick={() => navigate("/student/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
            <ArrowLeft size={15} /> Back to Dashboard
          </button>
        )}

        <p className="text-center text-xs text-gray-400">
          You must be physically present at the venue within {session?.radius || 100}m
        </p>
      </div>
    </div>
  )
}
