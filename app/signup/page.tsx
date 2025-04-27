'use client';
import { useState } from 'react';
import Header from '@/components/Header';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'redirecting' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('redirecting');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('checkout failed');

      const { url } = (await res.json()) as { url: string };
      window.location.href = url;          // redirection Stripe
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-md rounded-lg p-8 w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Accès aux eBooks</h1>

          <input
            type="email"
            name="email"
            placeholder="Ton email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-6 px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
          />

          <button
            type="submit"
            disabled={status === 'redirecting'}
            className="w-full bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            {status === 'redirecting' ? 'Redirection...' : 'Payer et accéder'}
          </button>

          {status === 'error' && (
            <p className="mt-4 text-red-600 text-center">Erreur. Réessaye.</p>
          )}
        </form>
      </div>
    </>
  );
}
// app/signup/page.tsx