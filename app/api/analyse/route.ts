import OpenAI from "openai";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode } = body;

    if (mode === "analysis") {
      const { profile, description, answers, answerIndexes } = body;

      const prompt = `
Vous êtes un concepteur de dispositifs digitaux.

Votre mission n’est pas de faire une analyse complète.
Votre mission est de créer une expérience courte qui sert de démonstration.

CONTEXTE

Profil : ${profile || "Non défini"}
Description : ${description || "Non disponible"}
Réponses : ${Array.isArray(answers) ? JSON.stringify(answers) : "Non disponibles"}

OBJECTIF

Produire un texte structuré en 4 blocs, avec un effet précis :

1. Donner un début de lecture (très court)
2. Créer une frustration volontaire (on coupe)
3. Révéler que c’est un dispositif
4. Basculer vers la capacité à créer des points d’entrée

IMPORTANT

- Le texte doit être court (100 à 140 mots max)
- Aucun développement long
- Aucun ton psychologique
- Aucun conseil
- Aucun jargon émotionnel
- Pas de texte flou ou générique

STRUCTURE OBLIGATOIRE

BLOC 1 — MICRO LECTURE (2 à 3 lignes maximum)

- Une lecture simple, directe
- Pas d’analyse profonde
- Pas de “vous êtes”
- Pas de psychologie
- Juste une mise en lumière légère

BLOC 2 — COUPURE

Phrase obligatoire (ou équivalent très proche) :

"On pourrait aller plus loin.  
Mais ce n’est pas le sujet ici."

BLOC 3 — BASCULE LABORATOIRE

- Expliquer que ce qui vient d’être vécu est un point d’entrée
- Insister sur le fait que c’est conçu, structuré, volontaire
- Ton clair, sobre, sans marketing lourd

BLOC 4 — OUVERTURE BUSINESS

- Expliquer que ce type de dispositif peut être créé sur mesure
- Parler d’activité, d’expertise, de transformation visiteur → demande
- Pas de promesse exagérée

STYLE

- phrases courtes
- ton direct
- vocabulaire simple mais précis
- aucune lourdeur
- aucune phrase inutile

INTERDIT

- “vous ressentez”
- “vous êtes”
- toute interprétation psychologique
- toute analyse longue
- toute posture de coach

TERMINAISON

Terminer uniquement par :

arnaudcrestey.com
`;
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      });

      const analysis =
        completion.choices[0]?.message?.content?.trim() ||
        "Votre blocage actuel semble traduire un mécanisme intérieur de protection. Le comprendre permet déjà de retrouver davantage de clarté, de recul et de mouvement. Certains freins prennent racine dans la personnalité, l’histoire émotionnelle ou le besoin de sécurité. Le Cabinet Astrae propose une analyse plus complète pour explorer ces dynamiques en profondeur, notamment à travers l’étude du thème astral.";

      return NextResponse.json({ analysis });
    }

    if (mode === "lead") {
      const {
        firstName,
        email,
        birthDay,
        birthMonth,
        birthYear,
        birthHour,
        birthMinute,
        birthPlace,
        profile,
        description,
        analysis,
        answers,
        answerIndexes,
      } = body;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "arnaud.crestey14@gmail.com",
        subject: `Nouveau lead Blocage Scan - ${firstName || "Sans prénom"}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 720px; margin: 0 auto;">
            <h2 style="margin-bottom: 16px;">Nouveau lead Blocage Scan</h2>

            <p><strong>Prénom :</strong> ${firstName || "Non renseigné"}</p>
            <p><strong>Email :</strong> ${email || "Non renseigné"}</p>
            <p><strong>Date de naissance :</strong> ${birthDay || "--"}/${birthMonth || "--"}/${birthYear || "----"}</p>
            <p><strong>Heure de naissance :</strong> ${birthHour || "--"}:${birthMinute || "--"}</p>
            <p><strong>Lieu de naissance :</strong> ${birthPlace || "Non renseigné"}</p>

            <hr style="margin: 24px 0;" />

            <p><strong>Profil dominant :</strong> ${profile || "Non défini"}</p>
            <p><strong>Description courte :</strong> ${description || "Non disponible"}</p>
            <p><strong>Réponses profil :</strong> ${
              Array.isArray(answers) ? answers.join(", ") : "Non disponibles"
            }</p>
            <p><strong>Index des réponses :</strong> ${
              Array.isArray(answerIndexes)
                ? answerIndexes.join(", ")
                : "Non disponibles"
            }</p>

            <hr style="margin: 24px 0;" />

            <h3 style="margin-bottom: 8px;">Analyse GPT</h3>
            <p>${(analysis || "Non disponible").replace(/\n/g, "<br/>")}</p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: "Lead envoyé avec succès.",
      });
    }

    return NextResponse.json(
      { error: "Mode invalide." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erreur API /analyse :", error);

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
