'use client';
import { useState } from 'react';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>

        <input
          type="text"
          name="name"
          placeholder="Ton nom"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
        />

        <input
          type="email"
          name="email"
          placeholder="Ton email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
        />

        <textarea
          name="message"
          placeholder="Pourquoi tu veux t’inscrire ?"
          value={form.message}
          onChange={handleChange}
          rows={4}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90"
        >
          {status === 'sending' ? 'Envoi en cours...' : 'Envoyer'}
        </button>

        {status === 'success' && (
          <p className="mt-4 text-green-600 text-center">Merci ! Ton inscription a été envoyée ✅</p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-red-600 text-center">Erreur. Essaie encore.</p>
        )}
      </form>
    </div>
  );
}
