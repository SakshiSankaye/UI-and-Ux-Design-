/* eslint-disable */
import { useState, useEffect } from 'react'
import {
    User, Mail, Phone, GraduationCap, Hash, Edit3, Save, X,
    CalendarDays, Ticket, Camera, Loader, CheckCircle,
} from 'lucide-react'
import API from '../../services/api'
import { useRegistrations } from '../../context/RegistrationContext'

export default function UserProfile() {
    const [editing,  setEditing]  = useState(false)
    const [saving,   setSaving]   = useState(false)
    const [saved,    setSaved]    = useState(false)
    const [profile,  setProfile]  = useState(null)
    const [loading,  setLoading]  = useState(true)
    const [error,    setError]    = useState("")

    const { registrations } = useRegistrations()

    const [form, setForm] = useState({
        name: "", email: "", phone: "", department: "", year: "", college: "",
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const stored = JSON.parse(localStorage.getItem("user") || "{}")
                const userId = stored._id || stored.id
                if (!userId) { setLoading(false); return; }
                const res = await API.get(`/api/users/${userId}`)
                const u = res.data
                setProfile(u)
                setForm({
                    name:       u.name       || "",
                    email:      u.email      || "",
                    phone:      u.phone      || "",
                    department: u.department || "",
                    year:       u.year       || "",
                    college:    u.college    || "",
                })
            } catch (err) {
                const stored = JSON.parse(localStorage.getItem("user") || "{}")
                setForm({
                    name:  stored.name  || "",
                    email: stored.email || "",
                    phone: "", department: "", year: "", college: "",
                })
                setError("Could not load full profile from server")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }))

    const handleSave = async () => {
        setSaving(true)
        setError("")
        try {
            const stored = JSON.parse(localStorage.getItem("user") || "{}")
            const userId = stored._id || stored.id
            const res = await API.put(`/api/users/${userId}`, form)
            setProfile(res.data)
            // Update localStorage name
            const updatedUser = { ...stored, name: form.name, email: form.email }
            localStorage.setItem("user", JSON.stringify(updatedUser))
            setEditing(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (err) {
            setError("Failed to save profile: " + (err.response?.data?.message || err.message))
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        if (profile) {
            setForm({
                name: profile.name || "", email: profile.email || "",
                phone: profile.phone || "", department: profile.department || "",
                year: profile.year || "", college: profile.college || "",
            })
        }
        setEditing(false)
        setError("")
    }

    const today = new Date()
    const todayStart = new Date(); todayStart.setHours(0,0,0,0)
    const upcoming = registrations.filter(r => {
        const d = r.eventId?.date ? new Date(r.eventId.date) : null
        return d && d >= todayStart
    }).length
    const past = registrations.length - upcoming

    const stats = [
        { label: "Events Registered", value: registrations.length, icon: Ticket,      color: "text-blue-500  bg-blue-50"   },
        { label: "Upcoming Events",    value: upcoming,             icon: CalendarDays, color: "text-amber-500 bg-amber-50"  },
        { label: "Past Events",        value: past,                 icon: CalendarDays, color: "text-green-500 bg-green-50"  },
    ]

    const avatarLetter = (form.name || "S").charAt(0).toUpperCase()

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24 text-gray-400">
                <Loader size={24} className="animate-spin mr-2" /> Loading profile…
            </div>
        )
    }

    return (
        <div className="max-w-screen-lg mx-auto space-y-6 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-2xl text-gray-900">My Profile</h1>
                    <p className="text-sm text-gray-400 mt-1">View and manage your account details</p>
                </div>
            </div>

            {saved && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm">
                    <CheckCircle size={15} /> Profile updated successfully!
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                            {avatarLetter}
                        </div>
                    </div>
                    <h2 className="font-bold text-xl text-gray-900">{form.name || "Student"}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{form.email}</p>
                    {form.department && (
                        <span className="mt-2 inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                            {form.department}
                        </span>
                    )}
                    {form.year && (
                        <p className="text-xs text-gray-400 mt-1">{form.year}</p>
                    )}

                    {/* Stats */}
                    <div className="w-full mt-6 grid grid-cols-1 gap-3">
                        {stats.map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color.split(" ")[1]}`}>
                                    <Icon size={14} className={color.split(" ")[0]} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs text-gray-400">{label}</p>
                                    <p className="font-bold text-gray-900">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Edit form */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900">Personal Information</h3>
                        {!editing ? (
                            <button onClick={() => setEditing(true)}
                                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                                <Edit3 size={14} /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={handleCancel}
                                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-2 rounded-xl">
                                    <X size={14} /> Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-4 py-2 rounded-xl">
                                    {saving ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {[
                            { label: "Full Name",   field: "name",       icon: User,          type: "text"  },
                            { label: "Email",       field: "email",      icon: Mail,          type: "email" },
                            { label: "Phone",       field: "phone",      icon: Phone,         type: "tel"   },
                            { label: "Department",  field: "department", icon: GraduationCap, type: "text"  },
                            { label: "Year",        field: "year",       icon: Hash,          type: "text"  },
                            { label: "College",     field: "college",    icon: GraduationCap, type: "text"  },
                        ].map(({ label, field, icon: Icon, type }) => (
                            <div key={field}>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                                    {label}
                                </label>
                                {editing ? (
                                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-blue-300">
                                        <Icon size={14} className="text-gray-400 shrink-0" />
                                        <input
                                            type={type}
                                            value={form[field]}
                                            onChange={e => handleChange(field, e.target.value)}
                                            className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
                                            placeholder={`Enter ${label.toLowerCase()}`}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                                        <Icon size={14} className="text-gray-400 shrink-0" />
                                        <span className="text-sm text-gray-700">
                                            {form[field] || <span className="text-gray-300 italic">Not set</span>}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
