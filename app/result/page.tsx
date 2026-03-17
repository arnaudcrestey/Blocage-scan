"use client";

import { profileDescriptions } from "@/components/quiz-data";

export default function ResultPage({
  searchParams,
}: {
  searchParams: { profile?: string };
}) {
  const profile = searchParams.profile || "CONFUSION";

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">

      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-3xl" />

      <section className="relative z-10 w-full max-w-4xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-10 text-white shadow-2xl space-y-8">

        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-widest text-indigo-200/60">
            Résultat Blocage Scan
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold">
            Votre blocage principal : {profile}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <h2 className="font-semibold mb-3">Diagnostic principal</h2>
            <p className="text-sm text-indigo-100/80 leading-relaxed">
              {profileDescriptions[profile as keyof typeof profileDescriptions]}
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 border border-white/10 flex items-center justify-center">
            <div className="text-indigo-200/70">Profil en cours d’analyse</div>
          </div>

        </div>

      </section>
    </main>
  );
}
