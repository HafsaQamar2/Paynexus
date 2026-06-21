"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

// Snapshots the referenced element and saves it as a single-page PDF.
// This keeps PDF export entirely client-side (no server rendering, no
// extra backend dependency) and guarantees the PDF matches the on-screen
// preview pixel-for-pixel, which matters for branded invoice templates.
export default function DownloadPdfButton({ targetRef, filename, label = "Download PDF", ...rest }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    if (!targetRef?.current) return;
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        backgroundColor: "#FFFFFF",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      pdf.save(filename || "document.pdf");
    } catch (err) {
      console.error("PDF export failed", err);
      alert("Could not generate the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleDownload} disabled={loading} {...rest}>
      {loading ? "Preparing…" : label}
    </Button>
  );
}
