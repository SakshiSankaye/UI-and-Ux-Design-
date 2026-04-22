/* eslint-disable */
import { useState } from "react";
import CertificateCard from "../components/CertificateCard";
import "../styles/certificates.css";

function StudentCertificates() {
  const [search, setSearch] = useState("");

  // Static certificate data (backend integration can be added later)
  const certificates = [
    {
      title: "Hackathon Winner",
      event: "National Hackathon",
      date: "March 2025",
      category: "Technical",
      verified: true,
      file: "https://via.placeholder.com/300",
      link: "https://example.com",
    },
    {
      title: "Dance Competition",
      event: "Cultural Fest",
      date: "Feb 2025",
      category: "Cultural",
      verified: false,
      file: "https://via.placeholder.com/300",
    },
  ];

  const filtered = certificates.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-screen-xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-sm text-gray-400 mt-1">Your earned certificates and achievements</p>
      </div>

      <input
        type="text"
        placeholder="Search certificates..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
      />

      {filtered.length > 0 ? (
        <div className="cert-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cert, index) => (
            <CertificateCard key={index} cert={cert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="font-semibold">No certificates found</p>
        </div>
      )}
    </div>
  );
}

export default StudentCertificates;
