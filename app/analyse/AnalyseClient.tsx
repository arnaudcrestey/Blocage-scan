"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AnalyseClient() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);

  useEffect(() => {

    const s1 = setTimeout(() => setStep(1), 600);
    const s2 = setTimeout(() => setStep(2), 1300);
    const s3 = setTimeout(() => setStep(3), 2000);

    const redirect = setTimeout(() => {
      router.push(`/result?${searchParams.toString()}`);
    }, 2800);

    return () => {
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
      clearTimeout(redirect);
    };

  }, [router, searchParams]);

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">

      {/* Background */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-3xl" />

      {/* Card */}
      <section className="relative z-10 w-full max-w-xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 text-center shadow-2xl">

        <h1 className="text-xl sm:text-2xl font-semibold mb-6">
          Votre analyse personnalisée est en cours...
        </h1>

        <div className="space-y-3 text-sm text-indigo-100/80 text-left max-w-sm mx-auto">

          <p className={step >= 1 ? "opacity-100" : "opacity-30"}>
            ✔ Analyse de vos réponses
          </p>

          <p className={step >= 2 ? "opacity-100" : "opacity-30"}>
            ✔ Identification de votre blocage principal
          </p>

          <p className={step >= 3 ? "opacity-100" : "opacity-30"}>
            ✔ Génération de votre lecture personnalisée
          </p>

        </div>

        <div className="mt-6 h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div className="h-full animate-pulse bg-gradient-to-r from-violet-400 to-indigo-400 w-full"/>
        </div>

        <p className="mt-4 text-xs text-indigo-200/60">
          Décodage de vos mécanismes internes en cours...
        </p>

      </section>
    </main>
  );
}
