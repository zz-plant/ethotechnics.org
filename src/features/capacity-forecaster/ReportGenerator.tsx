import { useState } from 'react';
import type React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ReportGeneratorProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export function ReportGenerator({ targetRef }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleExport = async () => {
    if (!targetRef.current) {
      setStatus('Chart area is not ready yet.');
      return;
    }

    setIsGenerating(true);
    setStatus(null);

    try {
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        scale: 2,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('capacity-forecast.pdf');
      setStatus('Report downloaded.');
    } catch (error) {
      console.error(error);
      setStatus('Unable to generate PDF. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="forecaster__actions">
      <button
        type="button"
        className="button ghost button--compact"
        onClick={() => void handleExport()}
        disabled={isGenerating}
      >
        {isGenerating ? 'Preparing report…' : 'Export PDF'}
      </button>
      {status ? (
        <p className="muted forecaster__status" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}

export default ReportGenerator;
