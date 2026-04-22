/* eslint-disable */
import { useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

function Feedback() {
  const [formLink, setFormLink] = useState("")

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Feedback</h2>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Paste Google Form Link
        </label>
        <input
          placeholder="https://forms.google.com/..."
          onChange={(e) => setFormLink(e.target.value)}
          className="border border-gray-300 rounded-xl p-3 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {formLink && (
          <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
            <h3 className="mb-4 font-semibold text-gray-800">Scan to Give Feedback</h3>
            <div className="flex justify-center">
              <QRCodeCanvas value={formLink} size={200} />
            </div>
            <a
              href={formLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 block mt-3 text-sm hover:underline break-all"
            >
              Open Form
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Feedback
