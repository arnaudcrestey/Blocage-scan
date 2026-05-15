"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  profileDescriptions,
  getProfileFromIndexes,
  computeDominantProfileFromIndexes,
  getRadarData,
  type Profile,
} from "@/components/quiz-data";
import RadarBlockage from "@/components/RadarBlockage";

export const dynamic = "force-dynamic";

function ResultContent() {
  const searchParams = useSearchParams();

  const answersParam = searchParams.get("answers") || "";
  const fallbackProfile = (searchParams.get("profile") || "CONFUSION") as Profile;

  const answerIndexes = useMemo(() => {
    return answersParam
      .split(",")
      .map((n) => Number(n))
      .filter((n) => !Number.isNaN(n));
  }, [answersParam]);

  const answerProfiles = useMemo(() => {
    if (!answerIndexes.length) return [fallbackProfile];
    return getProfileFromIndexes(answerIndexes);
  }, [answerIndexes, fallbackProfile]);

  const profile = useMemo(() => {
    if (!answerIndexes.length) return fallbackProfile;
    return computeDominantProfileFromIndexes(answerIndexes);
  }, [answerIndexes, fallbackProfile]);

  const radarData = useMemo(() => {
    if (!answerIndexes.length) {
      if (profile === "CONFUSION") {
        return [
          { subject: "Clarté", value: 10 },
          { subject: "Sécurité", value: 4 },
          { subject: "Maîtrise", value: 5 },
          { subject: "Élan", value: 4 },
          { subject: "Apaisement", value: 6 },
        ];
      }

      if (profile === "PEUR") {
        return [
          { subject: "Clarté", value: 4 },
          { subject: "Sécurité", value: 10 },
          { subject: "Maîtrise", value: 4 },
          { subject: "Élan", value: 3 },
          { subject: "Apaisement", value: 4 },
        ];
      }

      return [
        { subject: "Clarté", value: 5 },
        { subject: "Sécurité", value: 4 },
        { subject: "Maîtrise", value: 10 },
        { subject: "Élan", value: 7 },
        { subject: "Apaisement", value: 3 },
      ];
    }

    return getRadarData(answerIndexes);
  }, [answerIndexes, profile]);

  const [analysis, setAnalysis] = useState("Analyse en cours...");
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        setLoadingAnalysis(true);

        const res = await fetch("/api/analyse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: "analysis",
            profile,
            description: profileDescriptions[profile],
            answers: answerProfiles,
            answerIndexes,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Erreur analyse");
        }

        setAnalysis(
          data.analysis ||
            "Votre dynamique intérieure révèle un mécanisme dominant qu’il est utile de comprendre plus finement."
        );
      } catch (error) {
        console.error(error);
        setAnalysis(
          "Ce blocage traduit une manière intérieure de vous protéger, d’anticiper ou de garder la maîtrise. Le comprendre permet déjà de reprendre de la clarté et d’avancer plus justement."
        );
      } finally {
        setLoadingAnalysis(false);
      }
    };

    runAnalysis();
  }, [profile, answerProfiles, answerIndexes]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 text-white sm:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#16185f_0%,#25156f_35%,#48289d_100%)]" />
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-3xl" />

      <section className="relative z-10 w-full max-w-5xl space-y-6 rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:space-y-8 sm:p-8 md:p-10">
        <div className="space-y-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.24em] text-indigo-200/60 sm:text-xs">
            Résultat Blocage Scan
          </p>

          <h1 className="text-2xl font-semibold sm:text-4xl">
            Votre blocage principal : {profile}
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <h2 className="mb-3 text-lg font-semibold">
              Diagnostic principal
            </h2>

            <p className="text-sm leading-relaxed text-indigo-100/80 sm:text-base">
              {profileDescriptions[profile]}
            </p>

            <ul className="mt-4 space-y-1 text-xs text-indigo-200/70 sm:text-sm">
              <li>• Compréhension du fonctionnement interne</li>
              <li>• Identification du blocage dominant</li>
              <li>• Mise en lumière des mécanismes invisibles</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="text-center text-indigo-200/70">
              <p className="mb-3 text-sm">Profil comportemental</p>
            </div>

            <RadarBlockage data={radarData} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="mb-2 text-lg font-semibold">
            Analyse personnalisée
          </h2>

          <p className="text-sm leading-relaxed text-indigo-100/80 sm:text-base">
            {loadingAnalysis ? "Analyse en cours..." : analysis}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-6 text-center shadow-xl sm:p-8 md:p-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300 sm:text-xs">
            Exemple de point d’entrée interactif
          </p>

          <h3 className="mx-auto mt-3 max-w-3xl text-2xl font-semibold sm:text-3xl">
            Transformer ce concept en outil pour votre activité
          </h3>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-indigo-100/80 sm:text-base">
            Blocage Scan est une démonstration de parcours interactif. Ce type
            d’expérience peut être adapté à votre domaine pour mieux orienter un
            utilisateur, clarifier un besoin, valoriser une expertise ou créer
            un point d’entrée plus engageant qu’un formulaire classique.
          </p>

          <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h4 className="mb-2 font-semibold text-cyan-300">
                Clarifier un besoin
              </h4>
              <p className="text-sm leading-relaxed text-indigo-100/70">
                Aider un utilisateur à mieux comprendre sa situation ou sa
                demande.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h4 className="mb-2 font-semibold text-cyan-300">
                Valoriser une expertise
              </h4>
              <p className="text-sm leading-relaxed text-indigo-100/70">
                Transformer un savoir-faire en expérience interactive claire et
                crédible.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h4 className="mb-2 font-semibold text-cyan-300">
                Créer un point d’entrée
              </h4>
              <p className="text-sm leading-relaxed text-indigo-100/70">
                Remplacer un formulaire classique par un parcours plus
                engageant.
              </p>
            </div>
          </div>

          <a
            href="mailto:contact@systia.fr?subject=Demande%20d%E2%80%99adaptation%20%E2%80%94%20Point%20d%E2%80%99entr%C3%A9e%20interactif"
            className="mt-8 inline-flex w-full justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 sm:w-auto sm:text-lg"
          >
            Adapter ce système à mon activité
          </a>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="text-sm font-medium text-indigo-200/70 transition hover:text-white"
          >
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#16185f_0%,#25156f_35%,#48289d_100%)]" />
          <div className="relative z-10 rounded-3xl border border-white/20 bg-white/10 px-8 py-10 backdrop-blur-xl">
            Chargement du résultat...
          </div>
        </main>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
