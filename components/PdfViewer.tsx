import { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';

// Configure le chemin du worker PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ file }: { file: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const pdf = await pdfjs.getDocument(`/api/ebooks/${encodeURIComponent(file)}`).promise;
        const page = await pdf.getPage(1); // Affiche uniquement la première page
        const canvas = canvasRef.current;

        if (canvas) {
          const context = canvas.getContext('2d');
          if (context) {
            const viewport = page.getViewport({ scale: 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context, viewport }).promise;
          } else {
            throw new Error('Impossible d\'obtenir le contexte du canvas');
          }
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Erreur lors du chargement du PDF');
        console.error(err);
      }
    };

    loadPdf();
  }, [file]);

  if (loading) {
    return <div>Chargement du PDF...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PdfViewer;
