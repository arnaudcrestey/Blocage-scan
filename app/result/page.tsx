"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  profileDescriptions,
  getProfileFromIndexes,
  computeDominantProfile,
  getRadarData,
  type Profile,
} from "@/components/quiz-data";
import RadarBlockage from "@/components/RadarBlockage";

export const dynamic = "force-dynamic";

export default function ResultPage() {
  const searchParams = useSearchParams();

  const answersParam = searchParams.get("answers") || "";
  const fallbackProfile = (searchParams.get("profile") || "CONFUSION") as Profile;

  const answerIndexes = useMemo(
    () =>
      answersParam
        .split(",")
        .map((n) => Number(n))
        .filter((n) => !Number.isNaN(n)),
    [answersParam]
  );

  const answerProfiles = useMemo(() => {
    if (!answerIndexes.length) return [fallbackProfile];
    return getProfileFromIndexes(answerIndexes);
  }, [answerIndexes, fallbackProfile]);

  const profile = useMemo(() => {
    if (!answerProfiles.length) return fallbackProfile;
    return computeDominantProfile(answerProfiles);
  }, [answerProfiles, fallbackProfile]);

  const radarData = useMemo(() => {
    if (!answerIndexes.length) {
      return [
        { subject: "Clarté", value: profile === "CONFUSION" ? 8 : 3 },
        { subject: "Sécurité", value: profile === "PEUR" ? 8 : 3 },
        { subject: "Maîtrise", value: profile === "CONTRÔLE" ? 8 : 3 },
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

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

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
      setFirstName("");
      setEmail("");
      setBirthDay("");
      setBirthMonth("");
      setBirthYear("");
    } catch (error) {
      console.error(error);
      setMessage("Une erreur est survenue. Merci de réessayer.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#16185f_0%,#25156f_35%,#48289d_100%)]" />
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-3xl" />

      <section className="relative z-10 w-full max-w-5xl space-y-8 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-widest text-indigo-200/60">
            Résultat Blocage Scan
          </p>

          <h1 className="text-3xl font-semibold sm:text-4xl">
            Votre blocage principal : {profile}
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
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

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-center text-indigo-200/70">
              <p className="mb-4 text-sm">Profil comportemental</p>
            </div>

            <RadarBlockage data={radarData} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-2 font-semibold">Analyse personnalisée</h2>

          <p className="text-sm leading-relaxed text-indigo-100/80">
            {loadingAnalysis ? "Analyse en cours..." : analysis}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center space-y-4">
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

          <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-3">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Votre prénom"
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm placeholder:text-indigo-200/50"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm placeholder:text-indigo-200/50"
            />

            <div className="grid grid-cols-3 gap-2">
              <input
                value={birthDay}
                onChange={(e) =>
                  setBirthDay(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                placeholder="Jour"
                required
                className="rounded bg-white/10 px-3 py-2 text-sm border border-white/20"
              />
              <input
                value={birthMonth}
                onChange={(e) =>
                  setBirthMonth(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                placeholder="Mois"
                required
                className="rounded bg-white/10 px-3 py-2 text-sm border border-white/20"
              />
              <input
                value={birthYear}
                onChange={(e) =>
                  setBirthYear(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                placeholder="Année"
                required
                className="rounded bg-white/10 px-3 py-2 text-sm border border-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {sending ? "Envoi en cours..." : "Recevoir mon analyse complète"}
            </button>

            {message && (
              <p className="pt-2 text-sm text-indigo-100/80">{message}</p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
