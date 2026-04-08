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
Vous devez écrire un texte court, premium, fluide et directement utilisable en 3 paragraphes.

Le texte apparaît dans le laboratoire d’arnaudcrestey.com, après qu’une personne a testé un point d’entrée comme Blocage Scan.
Il ne s’agit pas d’une analyse complète.
Il s’agit d’une micro-lecture suivie d’une bascule vers l’idée centrale :
ce que la personne vient de vivre n’est qu’un exemple de point d’entrée que l’on peut concevoir sur mesure pour une activité.

CONTEXTE

Profil : ${profile || "Non défini"}
Description : ${description || "Non disponible"}
Réponses : ${Array.isArray(answers) ? JSON.stringify(answers) : "Non disponibles"}

OBJECTIF

Produire un texte en 3 paragraphes avec cette logique :

PARAGRAPHE 1
- Faire une micro-lecture courte, crédible et élégante
- 2 à 3 phrases maximum
- Faire émerger un point juste, simple, utile
- Aucun ton psychologique lourd
- Aucun jargon
- Aucune profondeur artificielle
- Le premier paragraphe doit se terminer par "..."

PARAGRAPHE 2
- Commencer exactement par :
Ce que vous venez de tester ici est un point d’entrée conçu pour provoquer ce type de déclic rapidement.
- Ce paragraphe doit être isolé visuellement, avec une ligne vide avant

PARAGRAPHE 3
- Ouvrir clairement sur arnaudcrestey.com
- Expliquer que ce laboratoire permet d’imaginer et de créer des dispositifs sur mesure
- Mentionner activité, expertise ou métier
- Montrer la finalité :
capter l’attention, engager utilement, transformer une visite en demande qualifiée

STYLE

- ton premium
- sobre
- clair
- fluide
- crédible
- légèrement stratégique
- aucune lourdeur
- aucune phrase générique
- aucun effet “coach”
- aucune structure visible
- pas de titre
- pas de puces

INTERDIT

- toute analyse psychologique
- toute interprétation profonde
- toute phrase de type “vous ressentez”, “vous êtes”, “votre peur”, “votre blessure”
- tout ton thérapeutique
- tout texte abstrait ou flou
- toute mention d’intelligence artificielle
- toute promesse exagérée
- tout vocabulaire comme : trauma, blocage profond, mécanisme intérieur, protection intérieure, aspiration profonde

FORMAT OBLIGATOIRE

- 3 paragraphes
- une ligne vide entre chaque paragraphe
- le premier paragraphe se termine par "..."
- le deuxième paragraphe commence exactement par la phrase imposée
- terminer uniquement par :

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
