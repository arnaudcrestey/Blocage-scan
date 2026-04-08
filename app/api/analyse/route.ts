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
Vous êtes un expert en psychologie comportementale et en compréhension des mécanismes de blocage.

Votre mission est de fournir une analyse claire, crédible et utile
à partir d’un diagnostic rapide basé sur 3 questions concernant la manière dont une personne se bloque aujourd’hui.

CONTEXTE

Profil dominant détecté : ${profile || "Non défini"}

Description de base :
${description || "Non disponible"}

Réponses au diagnostic :
${Array.isArray(answers) ? JSON.stringify(answers) : "Non disponibles"}

Index des réponses :
${Array.isArray(answerIndexes) ? JSON.stringify(answerIndexes) : "Non disponibles"}

RÈGLES D’ÉCRITURE

- Adressez-vous directement à la personne en utilisant "vous".
- Ne parlez jamais de "la personne".
- Le texte doit être naturel, fluide et crédible.
- Longueur : entre 90 et 130 mots.
- Évitez tout ton moralisateur, clinique, ésotérique ou trop affirmatif.
- Ne dramatisez pas.
- Ne faites pas de promesse.
- Ne donnez pas l’impression d’un diagnostic médical.

OBJECTIF

Aider à comprendre rapidement :

- le blocage principal actuel
- la logique interne de ce blocage
- ce qui freine aujourd’hui la clarté, la décision ou le passage à l’action

STRUCTURE

Rédigez un seul paragraphe fluide.

Expliquez que ce blocage n’est pas un hasard et qu’il peut être lié notamment à :

- la personnalité
- l’histoire émotionnelle
- des mécanismes de protection
- un besoin de sécurité, de cohérence ou de maîtrise

Le texte doit donner une sensation de justesse et de reconnaissance, sans surinterprétation.

FIN (TRÈS IMPORTANT)

Terminez par une seule phrase, courte et naturelle.

- Ne décrivez pas de système
- N’expliquez rien
- Ne faites pas de discours commercial

Faites simplement sentir que ce type d’approche peut aussi être utilisé dans d’autres contextes pour clarifier rapidement une situation et faciliter un échange.

Mentionnez arnaudcrestey.com de manière sobre, sans argumentaire.
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
