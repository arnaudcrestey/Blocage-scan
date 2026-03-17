'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { computeDominantProfile, Profile, questions } from '@/components/quiz-data';

export default function HomePage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Profile[]>([]);

  const progress = useMemo(() => ((step + 1) / questions.length) * 100, [step]);

  const handleAnswer = (profile: Profile) => {
    const nextAnswers = [...answers, profile];

    if (step === questions.length - 1) {
      const dominant = computeDominantProfile(nextAnswers);
      router.push(`/result?profile=${encodeURIComponent(dominant)}`);
      return;
    }

    setAnswers(nextAnswers);
    setStep((prev) => prev + 1);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">
      <div className="glow left-8 top-10" />
      <div className="glow bottom-10 right-8" />

      <section className="glass-card w-full max-w-md rounded-3xl p-6 text-center sm:p-8">
        {!started ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold leading-tight">
              Qu’est-ce qui vous bloque vraiment ?
            </h1>
            <p className="text-base text-indigo-100/90">
              En 30 secondes, identifiez le blocage principal qui freine votre vie.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="w-full rounded-full bg-violet-500 px-5 py-3 text-base font-semibold transition hover:bg-violet-400"
            >
              Commencer
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-violet-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-indigo-100/70">
              Question {step + 1} / {questions.length}
            </p>

            <div className="min-h-24 transition-opacity duration-300">
              <h2 className="text-xl font-medium leading-relaxed">{questions[step].title}</h2>
            </div>

            <div className="space-y-3 text-left">
              {questions[step].options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleAnswer(option.profile)}
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium transition hover:border-violet-300 hover:bg-violet-500/20"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
