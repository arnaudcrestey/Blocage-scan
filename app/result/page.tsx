'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { profileDescriptions, Profile } from '@/components/quiz-data';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const profile = useMemo(() => {
    const value = searchParams.get('profile');
    if (value === 'PEUR' || value === 'CONTRÔLE' || value === 'CONFUSION') return value;
    return 'CONFUSION';
  }, [searchParams]) as Profile;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('Envoi en cours...');

    const response = await fetch('/api/analyse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstName, email, profile })
    });

    if (response.ok) {
      setStatus('Analyse envoyée. Vérifiez votre email.');
      return;
    }

    setStatus('Une erreur est survenue. Réessayez.');
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="glow left-8 top-10" />
      <div className="glow bottom-10 right-8" />

      <section className="glass-card w-full max-w-md rounded-3xl p-6 sm:p-8">
        <h1 className="text-2xl font-semibold">Votre blocage principal : {profile}</h1>
        <p className="mt-3 text-indigo-100/90">{profileDescriptions[profile]}</p>

        <div className="mt-8 space-y-4">
          <p className="text-sm font-medium text-indigo-100">
            Voulez-vous comprendre l’origine réelle de ce blocage ?
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              placeholder="Prénom"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-indigo-100/60 focus:border-violet-300 focus:outline-none"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-indigo-100/60 focus:border-violet-300 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold transition hover:bg-violet-400"
            >
              Recevoir mon analyse
            </button>
          </form>

          {status ? <p className="text-sm text-indigo-100/90">{status}</p> : null}
        </div>
      </section>
    </main>
  );
}
