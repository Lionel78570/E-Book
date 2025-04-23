'use client';

// Renommer `dynamic` pour éviter le conflit avec l'importation de next/dynamic
export const forceDynamic = 'force-dynamic';  // ← Renommer cette constante

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

// Importation de dynamic sous un alias `dyn`
import dyn from 'next/dynamic';  // ← Renommer l'importation ici
const PdfViewer = dyn(() => import('@/components/PdfViewer'), { ssr: false });  // Charger côté client uniquement

export default function EbookPage() {
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();

  const ebookFiles = [
    { name: 'Ebook complet', file: 'ebook-complet.pdf' },
    { name: 'Astuces', file: 'ebook-astuces.pdf' },
    { name: 'Création', file: 'ebook-creation.pdf' },
    { name: 'Fournisseurs', file: 'ebook-fournisseur.pdf' },
    { name: 'Motivation', file: 'ebook-motivation.pdf' },
  ];

  // Vérification de l'accès via cookie
  useEffect(() => {
    fetch('/api/verify-access')
      .then((r) => r.json())
      .then((d: { authorized: boolean; email?: string }) => {
        if (d.authorized) {
          setAuthorized(true);
          setEmail(d.email ?? '');
        } else {
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  // Blocage des raccourcis clavier
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'u'].includes(e.key.toLowerCase()))
        e.preventDefault();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  if (!authorized) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-md rounded-lg p-8 w-full max-w-3xl">
          <h1 className="text-2xl font-bold mb-4">📚 Tes E‑books</h1>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Connecté avec : <span className="font-medium">{email}</span>
          </p>

          <ul className="space-y-8">
            {ebookFiles.map(({ name, file }) => (
              <li key={file}>
                <details className="group border rounded-lg p-4">
                  <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-medium text-lg">
                    📖 {name}
                  </summary>

                  {/* Utilisation du composant PdfViewer pour afficher le PDF */}
                  <PdfViewer file={file} />
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
