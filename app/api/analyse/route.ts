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
Vous êtes un expert en psychologie comportementale, en dynamiques de blocage intérieur et en lecture des mécanismes de protection.

Votre mission est de fournir une analyse claire, crédible et utile
à partir d’un diagnostic rapide basé sur 3 questions concernant la manière dont une personne se bloque aujourd’hui.

IMPORTANT

Profil dominant détecté : ${profile || "Non défini"}

Description de base :
${description || "Non disponible"}

Réponses au diagnostic :
${Array.isArray(answers) ? JSON.stringify(answers) : "Non disponibles"}

Index des réponses :
${Array.isArray(answerIndexes) ? JSON.stringify(answerIndexes) : "Non disponibles"}

RÈGLES IMPORTANTES

- Adressez-vous directement à la personne en utilisant "vous".
- Ne parlez jamais de "la personne".
- Le texte doit rester naturel, crédible et facile à lire.
- Maximum : 90 à 130 mots.
- Évitez un ton moralisateur, trop clinique ou ésotérique.
- Le texte doit être fluide, moderne, rassurant et professionnel.

OBJECTIF

Aider l’utilisateur à comprendre rapidement :

- son blocage principal actuel
- la logique interne de ce blocage
- ce qui freine aujourd’hui son passage à l’action ou sa clarté

STRUCTURE OBLIGATOIRE

Analyse

Rédigez un court paragraphe expliquant ce que signifie ce profil de blocage aujourd’hui.

Expliquez que ce blocage n’est pas un hasard et qu’il peut être lié notamment à :

- la personnalité
- l’histoire émotionnelle
- les mécanismes de protection
- les besoins de sécurité ou de maîtrise

Terminez par une phrase ouvrant sur une exploration plus approfondie.

Mentionnez naturellement que le Cabinet Astrae propose une analyse plus complète
pour explorer ces mécanismes en profondeur, notamment grâce à l’étude du thème astral.
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
