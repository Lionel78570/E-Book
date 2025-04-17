'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'error'>('idle');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('checking');

    try {
      const res = await fetch('/api/verify-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: isAdmin ? password : undefined }),
      });

      const data = await res.json();

      if (data.authorized) {
        localStorage.setItem('userEmail', email);
        if (data.admin) {
          localStorage.setItem('isAdmin', 'true');
          router.push('/admin');
        } else {
          localStorage.removeItem('isAdmin');
          router.push('/ebook');
        }
      } else {
        setStatus('error');
        console.log('Access denied: email or password incorrect.');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail === 'admin@ebook.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
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
          <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>

          <input
            type="email"
            name="email"
            placeholder="Ton email"
            value={email}
            onChange={handleEmailChange}
            required
            className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
          />

          {isAdmin && (
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mb-4 px-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
            />
          )}

          <button
            type="submit"
            disabled={status === 'checking'}
            className="w-full bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            {status === 'checking' ? 'Vérification...' : 'Se connecter'}
          </button>

          {status === 'error' && (
            <p className="mt-4 text-red-600 text-center">Accès refusé. Email ou mot de passe incorrect.</p>
          )}
        </form>
      </div>
    </>
  );
}
