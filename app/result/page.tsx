"use client";

export const dynamic = "force-dynamic";

import { profileDescriptions } from "@/components/quiz-data";

export default function ResultPage({
  searchParams,
}: {
  searchParams: { profile?: string };
}) {
  const profile = searchParams.profile || "CONFUSION";

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12">

      {/* Background */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-3xl" />

      <section className="relative z-10 w-full max-w-5xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-10 text-white shadow-2xl space-y-8">

        {/* HEADER */}
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
              <li>• Compréhension de votre fonctionnement interne</li>
              <li>• Identification de votre blocage dominant</li>
              <li>• Mise en lumière de vos mécanismes invisibles</li>
            </ul>
          </div>

          {/* Radar (placeholder stylé) */}
          <div className="rounded-2xl bg-white/5 p-6 border border-white/10 flex items-center justify-center">
            <div className="text-center text-indigo-200/70">
              <p className="text-sm mb-2">Profil comportemental</p>

              <div className="w-40 h-40 rounded-full border border-white/20 flex items-center justify-center">
                Analyse en cours
              </div>
            </div>
          </div>

        </div>

        {/* ANALYSE */}
        <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
          <h2 className="font-semibold mb-2">Analyse personnalisée</h2>

          <p className="text-sm text-indigo-100/80 leading-relaxed">
            Ce blocage n’est pas un hasard. Il s’inscrit dans une dynamique plus profonde,
            souvent liée à votre histoire personnelle, vos schémas internes et votre manière
            d’interpréter les situations. Comprendre ce mécanisme est la première étape pour
            retrouver de la clarté et avancer avec plus de fluidité.
          </p>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-white/5 p-6 border border-white/10 text-center space-y-4">

          <h3 className="text-lg font-semibold">
            Comprendre réellement votre fonctionnement
          </h3>

          <p className="text-sm text-indigo-200/70">
            Au <span className="text-cyan-300">Cabinet Astrae</span>, nous analysons en profondeur
            vos mécanismes internes pour vous aider à dépasser ce blocage.
          </p>

          <p className="text-xs text-indigo-200/60">
            🎁 Recevez gratuitement votre lecture personnalisée complète
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

            <button className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 text-white font-semibold text-sm hover:opacity-90">
              Recevoir mon analyse complète
            </button>

          </div>

        </div>

      </section>
    </main>
  );
}
