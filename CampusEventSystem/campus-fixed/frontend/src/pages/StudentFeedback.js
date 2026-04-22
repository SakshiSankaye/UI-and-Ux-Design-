/* eslint-disable */
import { useState } from "react";
import { Star, Send, CheckCircle } from "lucide-react";

function StudentFeedback() {
  const [rating,      setRating]      = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [event,       setEvent]       = useState("");
  const [experience,  setExperience]  = useState("");
  const [message,     setMessage]     = useState("");
  const [submitted,   setSubmitted]   = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);

  const handleSubmit = () => {
    if (!event) { alert("Please select an event"); return; }
    if (rating === 0) { alert("Please select a rating"); return; }
    setFeedbackList(prev => [...prev, { event, rating, experience, message }]);
    setEvent(""); setRating(0); setExperience(""); setMessage("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Event Feedback</h1>
        <p className="text-sm text-gray-400 mt-1">Share your experience with us</p>
      </div>

      {submitted && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium">
          <CheckCircle size={16} /> Feedback submitted! Thank you.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        {/* Event Select */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Select Event</label>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Choose an event...</option>
            <option>Hackathon</option>
            <option>Seminar</option>
            <option>Tech Fest</option>
            <option>Cultural Fest</option>
          </select>
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  size={28}
                  className={`transition-colors ${star <= (hoverRating || rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Overall Experience</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">Select experience level...</option>
            <option>Excellent</option>
            <option>Good</option>
            <option>Average</option>
            <option>Poor</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Your Feedback</label>
          <textarea
            placeholder="Write your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          <Send size={16} /> Submit Feedback
        </button>
      </div>

      {/* History */}
      {feedbackList.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Previous Feedback</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left pb-2 text-xs text-gray-400 font-semibold uppercase">Event</th>
                <th className="text-left pb-2 text-xs text-gray-400 font-semibold uppercase">Rating</th>
                <th className="text-left pb-2 text-xs text-gray-400 font-semibold uppercase">Experience</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {feedbackList.map((f, i) => (
                <tr key={i}>
                  <td className="py-2.5 font-medium text-gray-800">{f.event}</td>
                  <td className="py-2.5 text-amber-400">{"★".repeat(f.rating)}</td>
                  <td className="py-2.5 text-gray-500">{f.experience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentFeedback;
