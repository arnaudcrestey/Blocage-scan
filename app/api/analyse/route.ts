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
Vous devez écrire un texte court en 3 paragraphes.

Le rendu doit correspondre à une démonstration intégrée dans un laboratoire de dispositifs digitaux.

CONTEXTE

Profil : ${profile || "Non défini"}
Description : ${description || "Non disponible"}
Réponses : ${Array.isArray(answers) ? JSON.stringify(answers) : "Non disponibles"}

OBJECTIF

Produire un texte fluide, crédible, directement utilisable, avec ce schéma :

PARAGRAPHE 1
- 2 à 3 phrases maximum
- Une mise en lumière simple d’un point (sans analyse psychologique)
- Pas de “vous êtes”
- Pas de jargon
- Donner une sensation de justesse rapide, sans profondeur artificielle

PARAGRAPHE 2
- Une phrase simple qui explique :
  ce que la personne vient de tester est un point d’entrée conçu
- Ton sobre, évident, sans marketing

PARAGRAPHE 3
- Ouverture claire vers arnaudcrestey.com
- Expliquer que ce laboratoire permet de créer des dispositifs sur mesure
- Mentionner :
  activité, expertise, métier
- Montrer la finalité :
  capter l’attention, engager utilement, transformer une visite en demande qualifiée

STYLE

- naturel
- fluide
- crédible
- aucune lourdeur
- aucune structure visible
- aucune mention de “bloc”, “analyse”, “dispositif IA”

INTERDIT

- toute analyse psychologique
- toute interprétation profonde
- toute phrase générique type “vous ressentez”
- tout ton coach / thérapeute
- tout texte abstrait ou flou

FORMAT

- 3 paragraphes espacés
- pas de titre
- pas de structure visible

TERMINAISON

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
