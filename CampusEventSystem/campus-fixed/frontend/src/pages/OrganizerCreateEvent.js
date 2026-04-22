/* eslint-disable */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
    CalendarDays, Upload, CheckCircle, AlertCircle, Loader, ImageIcon, X
} from "lucide-react";

export default function OrganizerCreateEvent() {
    const navigate   = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const userName   = storedUser.name || storedUser.email?.split("@")[0] || "Organizer";

    const [loading,      setLoading]      = useState(false);
    const [imgUploading, setImgUploading] = useState(false);
    const [successMsg,   setSuccessMsg]   = useState("");
    const [errorMsg,     setErrorMsg]     = useState("");
    const [preview,      setPreview]      = useState("");
    const [imageUrl,     setImageUrl]     = useState("");

    const [formData, setFormData] = useState({
        title: "", description: "", category: "", venue: "",
        date: "", time: "", endTime: "", deadline: "", maxParticipants: "",
        type: "offline", link: "", tags: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg("");
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setImgUploading(true);
        setErrorMsg("");
        try {
            const fd = new FormData();
            fd.append("image", file);
            const res = await API.post("/api/upload/image", fd, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setImageUrl(res.data.url);
        } catch (err) {
            setErrorMsg("Image upload failed: " + (err.response?.data?.message || err.message));
            setPreview("");
            setImageUrl("");
        } finally {
            setImgUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setPreview("");
        setImageUrl("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim())  { setErrorMsg("Event title is required"); return; }
        if (!formData.date)          { setErrorMsg("Event date is required"); return; }
        if (!formData.venue.trim())  { setErrorMsg("Event venue is required"); return; }
        if (!formData.description.trim()) { setErrorMsg("Event description is required"); return; }
        if (!formData.category)      { setErrorMsg("Event category is required"); return; }
        if (!imageUrl)               { setErrorMsg("Event image is required. Please upload an image."); return; }

        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            await API.post("/api/events/create", {
                ...formData,
                image: imageUrl,
                maxParticipants: formData.maxParticipants || 0,
            });

            setSuccessMsg("✅ Event submitted for admin approval!");
            setFormData({
                title: "", description: "", category: "", venue: "",
                date: "", time: "", endTime: "", deadline: "", maxParticipants: "",
                type: "offline", link: "", tags: "",
            });
            setPreview("");
            setImageUrl("");
            setTimeout(() => navigate("/organizer/manage-events"), 2000);
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to create event.";
            setErrorMsg("❌ " + msg);
        } finally {
            setLoading(false);
        }
    };

    const Field = ({ label, name, type = "text", placeholder, required, as }) => (
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            {as === "textarea" ? (
                <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            )}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <div>
                <h1 className="font-bold text-2xl text-gray-900">Create New Event</h1>
                <p className="text-sm text-gray-400 mt-1">Fill in all required fields to submit for approval</p>
            </div>

            {successMsg && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-sm">
                    <CheckCircle size={16} /> {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                    <AlertCircle size={16} /> {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                {/* Image Upload */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Event Image <span className="text-red-400">*</span>
                    </label>
                    {preview ? (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 h-48">
                            <img src={preview} alt="preview" className="w-full h-full object-cover" />
                            {imgUploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Loader size={24} className="text-white animate-spin" />
                                    <span className="text-white text-sm ml-2">Uploading...</span>
                                </div>
                            )}
                            {!imgUploading && imageUrl && (
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <CheckCircle size={11} /> Uploaded
                                    </span>
                                    <button type="button" onClick={handleRemoveImage}
                                        className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                            <ImageIcon size={28} className="text-gray-300 mb-2" />
                            <span className="text-sm font-semibold text-gray-500">Click to upload image</span>
                            <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    )}
                </div>

                <Field label="Event Title"    name="title"       placeholder="e.g. Tech Summit 2025" required />
                <Field label="Description"    name="description" placeholder="Describe the event..."   required as="textarea" />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Category <span className="text-red-400">*</span>
                        </label>
                        <select name="category" value={formData.category} onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                            <option value="">Select category</option>
                            <option>Technology</option>
                            <option>Workshop</option>
                            <option>Music</option>
                            <option>Design</option>
                            <option>Career</option>
                            <option>Sports</option>
                            <option>Cultural</option>
                            <option>Academic</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                            Event Type
                        </label>
                        <select name="type" value={formData.type} onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                            <option value="offline">Offline</option>
                            <option value="online">Online</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>

                <Field label="Venue"          name="venue"       placeholder="Room / Building / Online" required />

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Date"       name="date"        type="date" required />
                    <Field label="Time"       name="time"        type="time" />
                    <Field label="End Time"   name="endTime"     type="time" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Registration Deadline" name="deadline"        type="date" />
                    <Field label="Max Participants"       name="maxParticipants" type="number" placeholder="0 = unlimited" />
                </div>

                <Field label="Tags (comma separated)" name="tags" placeholder="tech, coding, workshop" />
                <Field label="Event Link (optional)"  name="link" placeholder="https://..." />

                <button
                    type="submit"
                    disabled={loading || imgUploading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    {loading ? <><Loader size={16} className="animate-spin" /> Submitting...</> : <><CalendarDays size={16} /> Submit for Approval</>}
                </button>
            </form>
        </div>
    );
}
