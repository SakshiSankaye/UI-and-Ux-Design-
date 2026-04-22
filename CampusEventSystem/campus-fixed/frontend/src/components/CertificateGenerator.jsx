import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function CertificateGenerator() {
  const certificateRef = useRef();

  const downloadCertificate = () => {
    html2canvas(certificateRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape");
      pdf.addImage(imgData, "PNG", 10, 10, 280, 180);
      pdf.save("certificate.pdf");
    });
  };

  return (
    <div className="p-10">

      <div
        ref={certificateRef}
        className="border-4 border-blue-600 p-10 text-center bg-white"
      >
        <h1 className="text-4xl font-bold mb-4">Certificate of Participation</h1>

        <p className="text-xl">This certificate is proudly presented to</p>

        <h2 className="text-3xl font-bold text-blue-600 my-4">
          Student Name
        </h2>

        <p className="text-lg">
          for successfully participating in the
        </p>

        <h3 className="text-2xl font-semibold my-2">
          AI Workshop Event
        </h3>

        <p>Date: March 15, 2026</p>
      </div>

      <button
        onClick={downloadCertificate}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Download Certificate
      </button>

    </div>
  );
}

export default CertificateGenerator;