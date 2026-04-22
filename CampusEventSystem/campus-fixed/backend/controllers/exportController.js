const Registration = require("../models/Registration");
const Event        = require("../models/Event");

// ── GET /api/registrations/export/pdf/:eventId ────────────
exports.exportPDF = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const regs = await Registration.find({ eventId })
            .populate("studentId", "name email")
            .sort({ createdAt: 1 });

        const PDFDocument = require("pdfkit");
        const doc = new PDFDocument({ margin: 50, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="participants-${eventId}.pdf"`
        );
        doc.pipe(res);

        // ── Header ───────────────────────────────────────────
        doc.fontSize(22).font("Helvetica-Bold").text("Participants List", { align: "center" });
        doc.moveDown(0.4);
        doc.fontSize(13).font("Helvetica").fillColor("#444")
            .text(event.title, { align: "center" });
        doc.fontSize(10).fillColor("#888")
            .text(`Date: ${event.date || "TBD"}  |  Venue: ${event.venue || "TBD"}`, { align: "center" });
        doc.moveDown(0.8);

        // ── Divider ───────────────────────────────────────────
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#ddd").stroke();
        doc.moveDown(0.6);

        if (regs.length === 0) {
            doc.fontSize(12).fillColor("#888").text("No participants registered yet.", { align: "center" });
        } else {
            // ── Table header ──────────────────────────────────
            const colX = [50, 60, 250, 410];
            const rowHeight = 26;
            const tableTop = doc.y;

            doc.rect(50, tableTop, 495, rowHeight).fill("#1d4ed8");
            doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold");
            doc.text("#",     colX[0], tableTop + 8, { width: 30 });
            doc.text("Name",  colX[1], tableTop + 8, { width: 180 });
            doc.text("Email", colX[2], tableTop + 8, { width: 150 });
            doc.text("Registered On", colX[3], tableTop + 8, { width: 120 });

            // ── Table rows ────────────────────────────────────
            let y = tableTop + rowHeight;
            regs.forEach((reg, i) => {
                const name  = reg.name  || reg.studentId?.name  || "—";
                const email = reg.email || reg.studentId?.email || "—";
                const date  = reg.createdAt
                    ? new Date(reg.createdAt).toLocaleDateString("en-IN")
                    : "—";

                const bg = i % 2 === 0 ? "#f8fafc" : "#ffffff";
                doc.rect(50, y, 495, rowHeight).fill(bg);
                doc.fillColor("#374151").fontSize(9).font("Helvetica");
                doc.text(String(i + 1), colX[0], y + 8, { width: 30 });
                doc.text(name,          colX[1], y + 8, { width: 180 });
                doc.text(email,         colX[2], y + 8, { width: 150 });
                doc.text(date,          colX[3], y + 8, { width: 120 });
                y += rowHeight;

                // Page break
                if (y > 750) { doc.addPage(); y = 50; }
            });

            doc.moveDown(1);
            doc.fontSize(10).fillColor("#888")
                .text(`Total Participants: ${regs.length}`, { align: "right" });
        }

        doc.end();
    } catch (err) {
        console.error("PDF EXPORT ERROR:", err);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error generating PDF", error: err.message });
        }
    }
};

// ── GET /api/registrations/export/excel/:eventId ──────────
exports.exportExcel = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const regs = await Registration.find({ eventId })
            .populate("studentId", "name email")
            .sort({ createdAt: 1 });

        const ExcelJS = require("exceljs");
        const wb = new ExcelJS.Workbook();
        wb.creator = "Campus Event System";
        wb.created = new Date();

        const ws = wb.addWorksheet("Participants");

        // ── Column definitions ────────────────────────────────
        ws.columns = [
            { header: "#",               key: "sno",        width: 6  },
            { header: "Student Name",    key: "name",       width: 28 },
            { header: "Email",           key: "email",      width: 34 },
            { header: "Phone",           key: "phone",      width: 16 },
            { header: "Department",      key: "department", width: 20 },
            { header: "Year",            key: "year",       width: 10 },
            { header: "College",         key: "college",    width: 26 },
            { header: "Registered On",   key: "date",       width: 18 },
        ];

        // ── Title rows ────────────────────────────────────────
        ws.spliceRows(1, 0, [], []);   // insert 2 blank rows at top
        ws.getRow(1).getCell(1).value = `Participants — ${event.title}`;
        ws.getRow(1).getCell(1).font  = { bold: true, size: 14, color: { argb: "FF1D4ED8" } };
        ws.mergeCells("A1:H1");

        ws.getRow(2).getCell(1).value =
            `Date: ${event.date || "TBD"}  |  Venue: ${event.venue || "TBD"}  |  Total: ${regs.length}`;
        ws.getRow(2).getCell(1).font  = { italic: true, size: 10, color: { argb: "FF6B7280" } };
        ws.mergeCells("A2:H2");

        // ── Header row styling (row 3) ─────────────────────────
        const headerRow = ws.getRow(3);
        headerRow.font      = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
        headerRow.alignment = { vertical: "middle", horizontal: "center" };
        headerRow.height    = 22;
        headerRow.eachCell(cell => {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1D4ED8" } };
            cell.border = {
                top:    { style: "thin", color: { argb: "FF93C5FD" } },
                bottom: { style: "thin", color: { argb: "FF93C5FD" } },
            };
        });

        // ── Data rows ─────────────────────────────────────────
        regs.forEach((reg, i) => {
            const row = ws.addRow({
                sno:        i + 1,
                name:       reg.name  || reg.studentId?.name  || "—",
                email:      reg.email || reg.studentId?.email || "—",
                phone:      reg.phone      || "—",
                department: reg.department || "—",
                year:       reg.year       || "—",
                college:    reg.college    || "—",
                date:       reg.createdAt
                    ? new Date(reg.createdAt).toLocaleDateString("en-IN")
                    : "—",
            });
            row.height = 18;
            const bg = i % 2 === 0 ? "FFF8FAFC" : "FFFFFFFF";
            row.eachCell(cell => {
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
                cell.alignment = { vertical: "middle" };
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="participants-${eventId}.xlsx"`
        );

        await wb.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("EXCEL EXPORT ERROR:", err);
        if (!res.headersSent) {
            res.status(500).json({ message: "Error generating Excel", error: err.message });
        }
    }
};
