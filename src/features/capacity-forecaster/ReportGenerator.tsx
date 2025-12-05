import { useState } from 'react';
import type React from 'react';

interface ReportGeneratorProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export function ReportGenerator({ targetRef }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const loadExportTools = async () => {
    const [html2canvasModule, jsPDFModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    return {
      html2canvas: html2canvasModule.default,
      jsPDF: jsPDFModule.default,
    } satisfies {
      html2canvas: typeof import('html2canvas')['default'];
      jsPDF: typeof import('jspdf')['default'];
    };
  };

  const handleExport = async () => {
    if (!targetRef.current) {
      setStatus('Chart area is not ready yet.');
      return;
    }

    setIsGenerating(true);
    setStatus('Loading export tools…');

    let html2canvas: typeof import('html2canvas')['default'];
    let jsPDF: typeof import('jspdf')['default'];

    try {
      ({ html2canvas, jsPDF } = await loadExportTools());
    } catch (error) {
      console.error(error);
      setStatus('Unable to load export tools. Please retry.');
      setIsGenerating(false);
      return;
    }

    if (!targetRef.current) {
      setStatus('Chart area is not ready yet.');
      setIsGenerating(false);
      return;
    }

    setStatus('Capturing report…');

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
