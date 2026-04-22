/* eslint-disable */
import { useState } from "react";
import { Save, CheckCircle, User, Mail, Lock } from "lucide-react";

function StudentSettings() {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");

  const [name,        setName]        = useState(stored.name  || "");
  const [email,       setEmail]       = useState(stored.email || "");
  const [saved,       setSaved]       = useState(false);

  const handleSave = () => {
    // Update localStorage with new name/email
    const updated = { ...stored, name, email };
    localStorage.setItem("user", JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
          <CheckCircle size={16} /> Settings saved successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-sm">Profile Information</h2>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            <User size={11} className="inline mr-1" /> Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            <Mail size={11} className="inline mr-1" /> Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
        <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
          <Lock size={14} /> Security
        </h2>
        <p className="text-xs text-gray-400">Password changes are handled via the Forgot Password flow.</p>
        <a href="/forgot-password" className="inline-block text-xs text-blue-600 hover:underline font-medium">
          Change Password →
        </a>
      </div>
    </div>
  );
}

export default StudentSettings;
