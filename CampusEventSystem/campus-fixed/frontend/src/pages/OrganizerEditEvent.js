/* eslint-disable */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Loader, CheckCircle, AlertCircle, ImageIcon, X } from "lucide-react";

export default function OrganizerEditEvent() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [msg,          setMsg]          = useState({ type: "", text: "" });
  const [preview,      setPreview]      = useState("");
  const [imageUrl,     setImageUrl]     = useState("");

  const [form, setForm] = useState({
    title: "", description: "", date: "", time: "", endTime: "", venue: "",
    category: "", type: "", maxParticipants: "", deadline: "", tags: "", link: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/api/events/${id}`);
        const e   = res.data;
        setForm({
          title:           e.title           || "",
          description:     e.description     || "",
          date:            e.date ? e.date.split("T")[0] : "",
          time:            e.time            || "",
            endTime:         e.endTime         || "",
          venue:           e.venue           || "",
          category:        e.category        || "",
          type:            e.type            || "offline",
          maxParticipants: e.maxParticipants || "",
          deadline:        e.deadline ? e.deadline.split("T")[0] : "",
          tags:            e.tags            || "",
          link:            e.link            || "",
        });
        if (e.image) { setPreview(e.image); setImageUrl(e.image); }
      } catch { setMsg({ type: "error", text: "Failed to load event data" }); }
      finally   { setLoading(false); }
    };
    load();
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await API.post("/api/upload/image", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setImageUrl(res.data.url);
    } catch { setMsg({ type: "error", text: "Image upload failed" }); }
    finally   { setImgUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      await API.put(`/api/events/${id}`, { ...form, image: imageUrl || undefined });
      setMsg({ type: "success", text: "Event updated successfully!" });
      setTimeout(() => navigate("/organizer/manage-events"), 1500);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to update event." });
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24 text-gray-400">
      <Loader size={22} className="animate-spin mr-2" /> Loading event…
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/organizer/manage-events")} className="text-gray-400 hover:text-gray-700">← Back</button>
        <div>
          <h1 className="font-bold text-2xl text-gray-900">Edit Event</h1>
          <p className="text-sm text-gray-400 mt-0.5">Update event information</p>
        </div>
      </div>

      {msg.text && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm border
          ${msg.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
          {msg.type === "error" ? <AlertCircle size={15} /> : <CheckCircle size={15} />} {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        {/* Image */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Event Image</label>
          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 h-44">
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
              {imgUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader size={22} className="text-white animate-spin" />
                </div>
              )}
              <button type="button" onClick={() => { setPreview(""); setImageUrl(""); }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-36 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <ImageIcon size={24} className="text-gray-300 mb-2" />
              <span className="text-sm text-gray-400">Click to upload image</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        {[
          { label: "Title",       name: "title",       type: "text" },
          { label: "Description", name: "description", as: "textarea" },
          { label: "Venue",       name: "venue",       type: "text" },
          { label: "Event Link",  name: "link",        type: "text" },
          { label: "Tags",        name: "tags",        type: "text" },
        ].map(({ label, name, type, as }) => (
          <div key={name}>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
            {as === "textarea" ? (
              <textarea name={name} value={form[name]} onChange={handleChange} rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
            ) : (
              <input type={type} name={name} value={form[name]} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            )}
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="">Select</option>
              {["Technology","Workshop","Music","Design","Career","Sports","Cultural","Academic","Other"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Date", name: "date", type: "date" },
            { label: "Time", name: "time", type: "time" },
            { label: "End Time", name: "endTime", type: "time" },
            { label: "Deadline", name: "deadline", type: "date" },
            { label: "Max Participants", name: "maxParticipants", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
              <input type={type} name={name} value={form[name]} onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving || imgUploading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors">
          {saving ? <><Loader size={15} className="animate-spin" /> Saving…</> : "💾 Save Changes"}
        </button>
      </form>
    </div>
  );
}
