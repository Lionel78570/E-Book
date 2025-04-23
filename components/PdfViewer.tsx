'use client';

import { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';

// ➜ même version API / worker
pdfjs.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs';

type Props = { file: string };

export default function PdfViewer({ file }: Props) {
  /* Réfs & états --------------------------------------------------------- */
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);

  const [doc , setDoc ] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [zoom , setZoom]  = useState(1);          // facteur zoom (1 = 100 %)

  /* ---------------------------------------------------------------------- */
  /* Chargement du PDF                                                      */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/ebooks/${file}`);
      if (!res.ok) throw new Error('fetch PDF failed');
      const blob = await res.blob();
      const pdf  = await pdfjs.getDocument(URL.createObjectURL(blob)).promise;

      setDoc(pdf);
      setPages(pdf.numPages);
    })().catch(console.error);
  }, [file]);

  /* ---------------------------------------------------------------------- */
  /* Rendu d’une page                                                       */
  /* ---------------------------------------------------------------------- */
  const render = async (pageNum: number, scaleFactor = zoom) => {
    if (!doc || !canvasRef.current || !containerRef.current) return;

    const pdfPage  = await doc.getPage(pageNum);
    const viewport = pdfPage.getViewport({ scale: 1 });
    /* ajuste la largeur, puis applique le zoom utilisateur --------------- */
    const baseScale   = containerRef.current.clientWidth / viewport.width;
    const finalScale  = baseScale * scaleFactor;
    const vp          = pdfPage.getViewport({ scale: finalScale });

    const canvas  = canvasRef.current;
    const context = canvas.getContext('2d')!;
    canvas.width  = vp.width;
    canvas.height = vp.height;

    await pdfPage.render({ canvasContext: context, viewport: vp }).promise;
  };

  /* Re‑render quand page ou zoom change ---------------------------------- */
  useEffect(() => { render(page); }, [doc, page, zoom]);

  /* ---------------------------------------------------------------------- */
  /* Handlers                                                               */
  /* ---------------------------------------------------------------------- */
  const next = () => page < pages && setPage(p => p + 1);
  const prev = () => page > 1     && setPage(p => p - 1);
  const zoomIn  = () => setZoom(z => Math.min(z + 0.2, 3));  // plafonné ×3
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5)); // mini ×0,5

  /* ---------------------------------------------------------------------- */
  /* UI                                                                     */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="flex flex-col gap-2">
      {/* Viewer ----------------------------------------------------------- */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '60vh',         /* > mobile : lisible, scroll interne   */
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <canvas ref={canvasRef} />
      </div>

      {/* Barre de navigation --------------------------------------------- */}
      <div className="flex items-center justify-between text-sm mt-2">
        <div className="flex gap-2">
          <button onClick={prev}  disabled={page === 1}>◀︎</button>
          <button onClick={next}  disabled={page === pages}>▶︎</button>
          <span>{page}/{pages}</span>
        </div>

        <div className="flex gap-2">
          <button onClick={zoomOut}>A–</button>
          <button onClick={zoomIn}>A+</button>
        </div>
      </div>
    </div>
  );
}
