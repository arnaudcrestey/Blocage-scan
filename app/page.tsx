'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { computeDominantProfile, Profile, questions } from '@/components/quiz-data';

// Mélange les réponses
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function HomePage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Profile[]>([]);

  // Randomisation des réponses
  const randomizedQuestions = useMemo(() => {
    return questions.map((q) => ({
      ...q,
      options: shuffleArray(q.options)
    }));
  }, []);

  const progress = useMemo(
    () => ((step + 1) / randomizedQuestions.length) * 100,
    [step, randomizedQuestions.length]
  );

  const handleAnswer = (profile: Profile) => {
    const nextAnswers = [...answers, profile];

    if (step === randomizedQuestions.length - 1) {
      const dominant = computeDominantProfile(nextAnswers);
      router.push(`/result?profile=${encodeURIComponent(dominant)}`);
      return;
    }

    setAnswers(nextAnswers);
    setStep((prev) => prev + 1);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10">

      {/* Background halos */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-3xl" />

      {/* Card */}
      <section className="relative z-10 w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-10 text-center shadow-2xl">

        {!started ? (
          <div className="space-y-6">

            {/* Badge */}
            <p className="inline-block rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-widest text-indigo-200">
              Diagnostic rapide
            </p>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
              Ce qui vous bloque aujourd’hui
              <br className="hidden sm:block" />
              n’est probablement pas ce que vous pensez…
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 max-w-xl mx-auto">
              En 30 secondes, découvrez le mécanisme invisible qui freine réellement votre vie.
            </p>

            {/* CTA */}
            <button
              onClick={() => setStarted(true)}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold text-sm sm:text-base transition hover:scale-105 hover:opacity-90"
            >
              Comprendre ce qui me bloque vraiment →
            </button>

            {/* Social proof */}
            <p className="text-xs text-indigo-200/70 flex items-center justify-center gap-2 opacity-80">
              <span>✨</span>
              <span>+12 000 personnes ont déjà compris ce qui les bloquait</span>
            </p>

          </div>
        ) : (
          <div className="space-y-6">

            {/* Progress bar */}
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step */}
            <p className="text-xs uppercase tracking-widest text-indigo-200/70">
              Question {step + 1} / {randomizedQuestions.length}
            </p>

            {/* Question */}
            <h2 className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed min-h-[80px]">
              {randomizedQuestions[step].title}
            </h2>

            {/* Hint */}
            <p className="text-xs text-indigo-200/60">
              Répondez instinctivement, sans trop réfléchir
            </p>

            {/* Answers */}
            <div className="space-y-3 text-left">
              {randomizedQuestions[step].options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleAnswer(option.profile)}
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-4 text-sm sm:text-base font-medium transition hover:border-violet-300 hover:bg-violet-500/20"
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
