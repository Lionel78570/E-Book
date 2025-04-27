'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const [status, setStatus] = useState<string>(''); // Variable pour le statut
  const [email, setEmail] = useState<string>('');
  const router = useRouter();

  // Extraire l'email de l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
      
      // Vérifier le statut de l'utilisateur via l'API
      fetch('/api/check-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailParam }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && (data.status === 'accepted' || data.status === 'paid')) {
            setStatus('Paiement validé. Tu as accès à tes ebooks !');
          } else {
            setStatus('Le paiement est en attente ou il y a un problème.');
          }
        })
        .catch(() => {
          setStatus('Erreur lors de la vérification du statut.');
        });
    }
  }, [email]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-md rounded-lg p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-6">Paiement réussi</h1>
          <p className="text-lg mb-4">Merci pour ton achat, {email} !</p>
          <p className="text-gray-500">{status}</p>
        </div>
      </div>
    </>
  );
}
