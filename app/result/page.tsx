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

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthHour, setBirthHour] = useState("");
  const [birthMinute, setBirthMinute] = useState("");

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
          "Ce blocage n’est pas un hasard. Il traduit une manière intérieure de vous protéger, d’anticiper ou de garder la maîtrise. Le comprendre permet déjà de reprendre de la clarté et d’avancer plus justement."
        );
      } finally {
        setLoadingAnalysis(false);
      }
    };

    runAnalysis();
  }, [profile, answerProfiles, answerIndexes]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSending(true);
      setMessage("");

      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "lead",
          firstName,
          email,
          birthDay,
          birthMonth,
          birthYear,
          birthHour,
          birthMinute,
          profile,
          description: profileDescriptions[profile],
          analysis,
          answers: answerProfiles,
          answerIndexes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erreur envoi");
      }

      setMessage("Votre demande a bien été envoyée.");
      setSubmitted(true);

      setFirstName("");
      setEmail("");
      setBirthDay("");
      setBirthMonth("");
      setBirthYear("");
      setBirthHour("");
      setBirthMinute("");
    } catch (error) {
      console.error(error);
      setMessage("Une erreur est survenue. Merci de réessayer.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 text-white sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#16185f_0%,#25156f_35%,#48289d_100%)]" />
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-3xl" />

        <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl">
            ✓
          </div>

          <h1 className="text-3xl font-semibold sm:text-4xl">
            Demande envoyée
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-indigo-100/85 sm:text-lg">
            Votre première lecture personnalisée vous sera envoyée par email
            dans quelques instants.
          </p>

          <p className="mt-4 text-sm text-indigo-200/70">
            Pensez à vérifier vos spams si vous ne voyez rien apparaître.
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Retour à l’accueil
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 text-white sm:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#16185f_0%,#25156f_35%,#48289d_100%)]" />
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-3xl" />

      <section className="relative z-10 w-full max-w-5xl space-y-6 rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:space-y-8 sm:p-8 md:p-10">
        <div className="text-center space-y-2">
          <p className="text-[10px] uppercase tracking-[0.24em] text-indigo-200/60 sm:text-xs">
            Résultat Blocage Scan
          </p>

          <h1 className="text-2xl font-semibold sm:text-4xl">
            Votre blocage principal : {profile}
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <h2 className="mb-3 font-semibold">Diagnostic principal</h2>

            <p className="text-sm leading-relaxed text-indigo-100/80">
              {profileDescriptions[profile]}
            </p>

            <ul className="mt-4 space-y-1 text-xs text-indigo-200/70">
              <li>• Compréhension de votre fonctionnement interne</li>
              <li>• Identification de votre blocage dominant</li>
              <li>• Mise en lumière de vos mécanismes invisibles</li>
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
          <h2 className="mb-2 font-semibold">Analyse personnalisée</h2>

          <p className="text-sm leading-relaxed text-indigo-100/80">
            {loadingAnalysis ? "Analyse en cours..." : analysis}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center sm:p-6">
          <h3 className="text-lg font-semibold">
            Comprendre réellement votre fonctionnement
          </h3>

          <p className="mt-3 text-sm text-indigo-200/70">
            Au <span className="text-cyan-300">Cabinet Astrae</span>, nous analysons en profondeur
            vos mécanismes internes pour vous aider à dépasser ce blocage.
          </p>

          <p className="mt-3 text-xs text-indigo-200/60">
            🎁 Recevez{" "}
            <span className="font-semibold text-cyan-300">gratuitement</span>{" "}
            votre lecture personnalisée complète
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-md space-y-4">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Votre prénom"
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-indigo-200/50 outline-none"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-indigo-200/50 outline-none"
            />

            <div className="space-y-2 text-left">
              <p className="text-xs uppercase tracking-[0.18em] text-indigo-200/65">
                Date de naissance
              </p>

              <div className="grid grid-cols-3 gap-2">
                <input
                  value={birthDay}
                  onChange={(e) =>
                    setBirthDay(e.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  placeholder="JJ"
                  required
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-indigo-200/50 outline-none md:placeholder:text-transparent"
                />
                <input
                  value={birthMonth}
                  onChange={(e) =>
                    setBirthMonth(e.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  placeholder="MM"
                  required
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-indigo-200/50 outline-none md:placeholder:text-transparent"
                />
                <input
                  value={birthYear}
                  onChange={(e) =>
                    setBirthYear(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="AA"
                  required
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-indigo-200/50 outline-none md:placeholder:text-transparent"
                />
              </div>

              <div className="hidden grid-cols-3 gap-2 md:grid">
                <p className="text-xs text-indigo-200/55">Jour</p>
                <p className="text-xs text-indigo-200/55">Mois</p>
                <p className="text-xs text-indigo-200/55">Année</p>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <p className="text-xs uppercase tracking-[0.18em] text-indigo-200/65">
                Heure de naissance
              </p>

              <div className="grid grid-cols-2 gap-2">
                <input
                  value={birthHour}
                  onChange={(e) =>
                    setBirthHour(e.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  placeholder="Heure"
                  required
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-indigo-200/50 outline-none md:placeholder:text-transparent"
                />
                <input
                  value={birthMinute}
                  onChange={(e) =>
                    setBirthMinute(e.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  placeholder="Minute"
                  required
                  className="rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm text-white placeholder:text-indigo-200/50 outline-none md:placeholder:text-transparent"
                />
              </div>

              <div className="hidden grid-cols-2 gap-2 md:grid">
                <p className="text-xs text-indigo-200/55">Heure</p>
                <p className="text-xs text-indigo-200/55">Minute</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {sending ? "Envoi en cours..." : "Recevoir mon analyse complète"}
            </button>

            {message && !submitted && (
              <p className="pt-2 text-sm text-indigo-100/80">{message}</p>
            )}
          </form>
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
