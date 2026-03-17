"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { profileDescriptions } from "@/components/quiz-data";

export default function ResultPage() {

  const params = useSearchParams();
  const profile = params.get("profile") || "CONFUSION";

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">

      {/* Background */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-3xl" />

      <section className="relative z-10 w-full max-w-4xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-10 text-white shadow-2xl space-y-8">

        {/* TITLE */}
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-widest text-indigo-200/60">
            Résultat Blocage Scan
          </p>

          <h1 className="text-3xl sm:text-4xl font-semibold">
            Votre blocage principal : {profile}
          </h1>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Diagnostic */}
          <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
            <h2 className="font-semibold mb-3">Diagnostic principal</h2>
            <p className="text-sm text-indigo-100/80 leading-relaxed">
              {profileDescriptions[profile as keyof typeof profileDescriptions]}
            </p>

            <ul className="mt-4 text-xs text-indigo-200/70 space-y-1">
              <li>• Compréhension de votre mécanisme interne</li>
              <li>• Identification de votre blocage dominant</li>
              <li>• Lecture de votre dynamique personnelle</li>
            </ul>
          </div>

          {/* Radar FAKE (placeholder) */}
          <div className="rounded-2xl bg-white/5 p-6 border border-white/10 flex items-center justify-center">
            <div className="text-center text-indigo-200/70">
              <p className="text-sm mb-2">Profil comportemental</p>
              <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
                Radar
              </div>
            </div>
          </div>

        </div>

        {/* ANALYSE */}
        <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
          <h2 className="font-semibold mb-2">Analyse personnalisée</h2>
          <p className="text-sm text-indigo-100/80 leading-relaxed">
            Votre fonctionnement actuel n’est pas un hasard. Il repose sur des mécanismes internes
            construits avec le temps. Comprendre ce blocage est la première étape pour retrouver
            de la fluidité et reprendre le contrôle de votre trajectoire.
          </p>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-white/5 p-6 border border-white/10 text-center space-y-4">

          <h3 className="text-lg font-semibold">
            Comprendre en profondeur votre fonctionnement
          </h3>

          <p className="text-sm text-indigo-200/70">
            Recevez gratuitement votre lecture personnalisée complète.
          </p>

          <div className="space-y-3 max-w-md mx-auto">

            <input
              placeholder="Votre prénom"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm placeholder:text-indigo-200/50"
            />

            <input
              placeholder="Votre email"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm placeholder:text-indigo-200/50"
            />

            <div className="grid grid-cols-3 gap-2">
              <input placeholder="Jour" className="px-3 py-2 rounded bg-white/10 border border-white/20 text-sm"/>
              <input placeholder="Mois" className="px-3 py-2 rounded bg-white/10 border border-white/20 text-sm"/>
              <input placeholder="Année" className="px-3 py-2 rounded bg-white/10 border border-white/20 text-sm"/>
            </div>

            <button className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-white font-semibold text-sm">
              Recevoir mon analyse complète
            </button>

          </div>

        </div>

      </section>
    </main>
  );
}
