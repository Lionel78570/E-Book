'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EbookPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const router = useRouter();

  const ebookFiles = [
    { name: 'Ebook complet', file: '1.EBOOK COMPLET .pdf' },
    { name: 'Astuces', file: 'EBOOK - ASTUCES.pdf' },
    { name: 'Création', file: 'EBOOK - CRÉATION.pdf' },
    { name: 'Fournisseurs', file: 'EBOOK - FOURNISSEURS.pdf' },
    { name: 'Motivation', file: 'EBOOK - MOTIVATION.pdf' },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const savedEmail = localStorage.getItem('userEmail');
      if (!savedEmail) {
        router.push('/login');
        return;
      }

      setEmail(savedEmail);

      try {
        const res = await fetch('/api/verify-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: savedEmail }),
        });

        const data = await res.json();

        if (data.authorized) {
          setAuthorized(true);
        } else {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-md rounded-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📚 Tes E-books</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Se déconnecter
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Connecté avec : <span className="font-medium">{email}</span>
        </p>

        <ul className="space-y-4">
          {ebookFiles.map((ebook, index) => (
            <li key={index}>
              <a
                href={`/ebooks/${ebook.file}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                📥 {ebook.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
