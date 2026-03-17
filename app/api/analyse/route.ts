import { NextResponse } from 'next/server';

const analyses = {
  CONFUSION:
    'Votre énergie est dispersée. Le prochain pas est de définir une direction unique sur 7 jours.',
  PEUR: 'Votre blocage vient surtout d’un risque perçu. Une micro-action quotidienne peut relancer votre élan.',
  CONTRÔLE:
    'Vous compensez par la maîtrise. Introduire plus de flexibilité vous aidera à retrouver un meilleur équilibre.'
};

export async function POST(request: Request) {
  const { firstName, email, profile } = await request.json();

  const shortAnalysis = analyses[profile as keyof typeof analyses] ?? analyses.CONFUSION;

  console.log('BLOCAGE SCAN lead', {
    firstName,
    email,
    profile,
    shortAnalysis
  });

  return NextResponse.json({ success: true, analysis: shortAnalysis });
}
