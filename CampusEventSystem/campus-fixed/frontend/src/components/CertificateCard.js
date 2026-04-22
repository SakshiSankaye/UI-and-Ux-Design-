import React from "react";

function CertificateCard({ cert }) {

  return (

    <div className="cert-card">

      {/* Image */}
      <div className={`cert-banner ${cert.category.toLowerCase()}`}>
  {cert.title}
</div>

      {/* Info */}
      <div className="cert-info">

        <h3>{cert.title}</h3>
        <p>{cert.event}</p>
        <p className="date">{cert.date}</p>

        <span className={`tag ${cert.category}`}>
          {cert.category}
        </span>

        {cert.verified && (
          <span className="verified">✔ Verified</span>
        )}

      </div>

      {/* Actions */}
      <div className="cert-actions">

  <a href={cert.file} target="_blank" rel="noreferrer" className="view-btn">
    View
  </a>

  <a href={cert.file} download className="download-btn">
    Download
  </a>

  {cert.link && (
    <a href={cert.link} target="_blank" rel="noreferrer" className="link-btn">
      Open Link
    </a>
  )}

</div>

    </div>

  );
}

export default CertificateCard;