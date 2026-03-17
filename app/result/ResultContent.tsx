'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { profileDescriptions, Profile } from '../../components/quiz-data';

export default function ResultContent() {
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, email, profile })
    });

    if (response.ok) {
      setStatus('Analyse envoyée. Vérifiez votre email.');
    } else {
      setStatus('Une erreur est survenue.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="glass-card w-full max-w-md p-6">
        <h1>Votre blocage : {profile}</h1>
        <p>{profileDescriptions[profile]}</p>

        <form onSubmit={handleSubmit}>
          <input placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit">Recevoir</button>
        </form>

        <p>{status}</p>
      </div>
    </main>
  );
}
