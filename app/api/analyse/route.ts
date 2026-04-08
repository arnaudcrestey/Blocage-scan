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
Vous êtes un analyste rédactionnel sobre et précis.

Votre mission est de produire une micro-analyse courte, claire et crédible à partir des éléments fournis.

CONTEXTE

Profil : ${profile || "Non défini"}
Description : ${description || "Non disponible"}
Réponses : ${Array.isArray(answers) ? JSON.stringify(answers) : "Non disponibles"}

OBJECTIF

Rédiger une analyse très courte, directement utilisable dans l’interface.

CONTRAINTES STRICTES

- 4 lignes maximum
- ton sobre, intelligent, crédible
- pas de jargon psychologique
- pas de profondeur artificielle
- pas de phrases creuses
- pas de conseils
- pas de ton coach
- pas de “vous êtes”
- pas de “vous ressentez”
- pas de vocabulaire comme : trauma, blessure, peur profonde, mécanisme intérieur, protection intérieure

STYLE ATTENDU

- une mise en lumière simple
- une formulation élégante
- une impression de justesse rapide
- une écriture fluide et naturelle
- chaque phrase doit être utile

IMPORTANT

- partir d’un point visible ou d’une tension simple
- rester concret
- ne pas surinterpréter
- ne pas expliquer toute la situation
- donner juste assez pour susciter l’intérêt

FORMAT

- un seul bloc de texte
- 3 à 4 phrases maximum
- aucune structure visible
- aucun titre
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
