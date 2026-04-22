/* eslint-disable */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, ArrowLeft, Loader } from "lucide-react";
import API from "../../services/api";
import { useRegistrations } from "../../context/RegistrationContext";

export default function RegisterForm() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const storedUser  = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ Use context so registration state updates everywhere immediately
  const { refresh, isRegistered, addRegistration } = useRegistrations();

  const [event,    setEvent]   = useState(null);
  const [success,  setSuccess] = useState(false);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState("");
  const [alreadyReg, setAlreadyReg] = useState(false);

  const [form, setForm] = useState({
    name:       storedUser.name  || "",
    email:      storedUser.email || "",
    phone:      "",
    department: "",
    year:       "",
    college:    "",
    extra:      "",
  });

  // Fetch event details
  useEffect(() => {
    API.get(`/api/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(console.error);
  }, [id]);

  // Check if already registered (using context's isRegistered)
  useEffect(() => {
    if (isRegistered(id)) setAlreadyReg(true);
  }, [id, isRegistered]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await API.post(`/api/registrations`, {
        eventId:    id,
        name:       form.name,
        email:      form.email,
        phone:      form.phone,
        department: form.department,
        year:       form.year,
        college:    form.college,
        extra:      form.extra,
      });

      // ✅ CRITICAL: refresh context so MyRegistrations & Calendar update
      await refresh();

      setSuccess(true);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      if (msg.toLowerCase().includes("already")) {
        setAlreadyReg(true);
        setError("You are already registered for this event.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Already registered screen ───────────────────────────
  if (alreadyReg && !success) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-5">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={42} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Already Registered</h2>
        <p className="text-gray-400">
          You are already registered for{" "}
          <strong className="text-gray-700">{event?.title || "this event"}</strong>.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/student/registrations")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            My Registrations
          </button>
          <button
            onClick={() => navigate("/student/browse")}
            className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            Browse More
          </button>
        </div>
      </div>
    );
  }

  // ── Success screen ──────────────────────────────────────
  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-5">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={42} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">You're Registered!</h2>
        <p className="text-gray-400">
          Successfully registered for{" "}
          <strong className="text-gray-700">{event?.title || "the event"}</strong>.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/student/registrations")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            My Registrations
          </button>
          <button
            onClick={() => navigate("/student/browse")}
            className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            Browse More
          </button>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Event Registration</h1>
        {event && (
          <p className="text-sm text-gray-400 mb-5">
            Registering for: <strong className="text-gray-700">{event.title}</strong>
            {event.date && ` · ${event.date}`}
          </p>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "name",       label: "Full Name",             type: "text",  req: true  },
            { name: "email",      label: "Email Address",         type: "email", req: true  },
            { name: "phone",      label: "Phone Number",          type: "tel",   req: false },
            { name: "department", label: "Department",            type: "text",  req: false },
            { name: "year",       label: "Year (e.g. 3rd Year)",  type: "text",  req: false },
            { name: "college",    label: "College / Institution", type: "text",  req: false },
          ].map(({ name, label, type, req }) => (
            <div key={name}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {label} {req && <span className="text-red-400">*</span>}
              </label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required={req}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              name="extra"
              value={form.extra}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Registering…
              </>
            ) : (
              "Confirm Registration"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
