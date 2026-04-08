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
Vous êtes un expert en conception de dispositifs digitaux à fort pouvoir de transformation.

Votre mission n’est PAS de faire une analyse.
Votre mission n’est PAS de vendre directement.

Votre mission est de produire une expérience courte, impactante, qui agit comme une démonstration implicite de ce qu’un dispositif bien conçu peut provoquer.

CONTEXTE

Profil : ${profile || "Non défini"}
Description : ${description || "Non disponible"}
Réponses : ${Array.isArray(answers) ? JSON.stringify(answers) : "Non disponibles"}

OBJECTIF

Créer un texte court (120 à 180 mots) qui produit un double effet :

1. Un effet immédiat de justesse (la personne se reconnaît)
2. Une compréhension implicite : ce qu’elle vient de vivre est construit, structuré, reproductible

IMPORTANT

Le texte doit être perçu comme une lecture rapide, mais il est en réalité une démonstration.

On ne vend pas un résultat.
On fait ressentir un mécanisme.

STRUCTURE OBLIGATOIRE

1. ACCROCHE IMMÉDIATE
Une phrase qui donne le sentiment d’être directement concerné, sans psychologie.

2. MISE EN LUMIÈRE SIMPLE
Mettre en évidence un point clair, presque évident, qui éclaire la situation.

3. EFFET DE CLARTÉ
Montrer que le simple fait de mettre des mots change déjà la perception.

4. BASCULE STRUCTURELLE (TRÈS IMPORTANT)
Faire comprendre subtilement que cette clarté ne vient pas par hasard, mais d’un regard structuré.

5. OUVERTURE STRATÉGIQUE
Suggérer implicitement que ce type de dispositif peut être conçu pour d’autres situations, notamment professionnelles.

INTERDIT

- Aucune analyse psychologique
- Aucun conseil
- Aucun ton thérapeutique
- Aucun jargon émotionnel (blocage, trauma, etc.)
- Aucune promesse commerciale directe
- Pas de “je” (ni coach, ni expert)

TON

- direct
- clair
- structuré
- légèrement stratégique
- sobre mais impactant

STYLE

- phrases courtes à moyennes
- langage accessible mais intelligent
- sensation de précision sans complexité

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
