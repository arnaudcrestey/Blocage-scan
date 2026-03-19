"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { questions } from "@/components/quiz-data";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function HomePage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const randomizedQuestions = useMemo(() => {
    return questions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
  }, []);

  const progress = useMemo(
    () => ((step + 1) / randomizedQuestions.length) * 100,
    [step, randomizedQuestions.length]
  );

  const handleAnswer = (optionIndex: number) => {
    const nextAnswers = [...answers, optionIndex];

    if (step === randomizedQuestions.length - 1) {
      router.push(`/result?answers=${nextAnswers.join(",")}`);
      return;
    }

    setAnswers(nextAnswers);
    setStep((prev) => prev + 1);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-3xl" />

      <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10 lg:max-w-3xl xl:max-w-4xl">
        {!started ? (
          <div className="space-y-6">
            <p className="inline-block rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-widest text-indigo-200">
              Diagnostic rapide
            </p>

            <h1 className="text-2xl font-semibold leading-tight sm:text-3xl lg:text-4xl">
              Ce qui vous bloque aujourd’hui
              <br className="hidden sm:block" />
              n’est probablement pas ce que vous pensez…
            </h1>

            <p className="mx-auto max-w-xl text-sm text-indigo-100/90 sm:text-base lg:text-lg">
              En 30 secondes, découvrez le mécanisme invisible qui freine réellement votre vie.
            </p>

            <button
              onClick={() => setStarted(true)}
              className="w-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-8 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:opacity-90 sm:w-auto sm:text-base"
            >
              Comprendre ce qui me bloque vraiment →
            </button>

            <p className="flex items-center justify-center gap-2 text-xs text-indigo-200/70 opacity-80">
              <span>✨</span>
              <span>+12 000 personnes ont déjà compris ce qui les bloquait</span>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs uppercase tracking-widest text-indigo-200/70">
              Question {step + 1} / {randomizedQuestions.length}
            </p>

            <h2 className="min-h-[80px] text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl">
              {randomizedQuestions[step].title}
            </h2>

            <p className="text-xs text-indigo-200/60">
              Répondez instinctivement, sans trop réfléchir
            </p>

            <div className="space-y-3 text-left">
              {randomizedQuestions[step].options.map((option, index) => (
                <button
                  key={`${option.label}-${index}`}
                  onClick={() => handleAnswer(index)}
                  className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-4 text-sm font-medium transition hover:border-violet-300 hover:bg-violet-500/20 sm:text-base"
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
