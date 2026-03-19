export type Profile = "CONFUSION" | "PEUR" | "CONTRÔLE";

export type RadarScores = {
  clarte: number;
  securite: number;
  maitrise: number;
  elan: number;
  apaisement: number;
};

export type Question = {
  title: string;
  options: {
    label: string;
    profile: Profile;
    weight: number;
    radar: RadarScores;
  }[];
};

export const questions: Question[] = [
  {
    title: "Quand vous pensez à avancer dans votre vie, vous ressentez surtout :",
    options: [
      {
        label: "Un flou… vous ne savez pas vraiment par où commencer",
        profile: "CONFUSION",
        weight: 3,
        radar: { clarte: 4, securite: 1, maitrise: 1, elan: 1, apaisement: 2 },
      },
      {
        label: "Une tension intérieure, comme un frein invisible",
        profile: "PEUR",
        weight: 3,
        radar: { clarte: 1, securite: 4, maitrise: 1, elan: 1, apaisement: 1 },
      },
      {
        label: "Une pression forte de devoir tout maîtriser",
        profile: "CONTRÔLE",
        weight: 3,
        radar: { clarte: 1, securite: 1, maitrise: 4, elan: 2, apaisement: 1 },
      },
    ],
  },
  {
    title: "Face à une décision importante, votre réaction naturelle est :",
    options: [
      {
        label: "Analyser encore et encore sans réussir à trancher",
        profile: "CONFUSION",
        weight: 3,
        radar: { clarte: 4, securite: 1, maitrise: 2, elan: 1, apaisement: 1 },
      },
      {
        label: "Reporter ou éviter pour ne pas vous tromper",
        profile: "PEUR",
        weight: 3,
        radar: { clarte: 1, securite: 4, maitrise: 1, elan: 1, apaisement: 1 },
      },
      {
        label: "Forcer une décision rapidement pour garder le contrôle",
        profile: "CONTRÔLE",
        weight: 3,
        radar: { clarte: 1, securite: 1, maitrise: 4, elan: 3, apaisement: 1 },
      },
    ],
  },
  {
    title: "Ce qui vous épuise le plus aujourd’hui :",
    options: [
      {
        label: "Le sentiment de ne pas avancer clairement",
        profile: "CONFUSION",
        weight: 4,
        radar: { clarte: 5, securite: 1, maitrise: 1, elan: 1, apaisement: 2 },
      },
      {
        label: "La peur des conséquences si vous changez",
        profile: "PEUR",
        weight: 4,
        radar: { clarte: 1, securite: 5, maitrise: 1, elan: 1, apaisement: 1 },
      },
      {
        label: "La pression constante que vous vous imposez",
        profile: "CONTRÔLE",
        weight: 4,
        radar: { clarte: 1, securite: 1, maitrise: 5, elan: 2, apaisement: 1 },
      },
    ],
  },
];

export const profileDescriptions: Record<Profile, string> = {
  CONFUSION:
    "Vous avez du potentiel et des idées, mais un manque de clarté vous maintient dans l’hésitation. Votre énergie se disperse, ce qui ralentit vos décisions et votre passage à l’action.",

  PEUR:
    "Vous percevez parfois la bonne direction, mais une peur profonde freine votre mouvement. Ce n’est pas un manque de capacité, mais un mécanisme de protection qui limite votre évolution.",

  CONTRÔLE:
    "Vous avancez avec exigence et intensité, mais une pression interne forte vous empêche de lâcher prise. Ce besoin de maîtrise devient paradoxalement un frein.",
};

export function getProfileFromIndexes(answerIndexes: number[]): Profile[] {
  return answerIndexes.map((optionIndex, questionIndex) => {
    const question = questions[questionIndex];
    const option = question?.options[optionIndex];
    return option?.profile ?? "CONFUSION";
  });
}

export function computeDominantProfileFromIndexes(answerIndexes: number[]): Profile {
  const scores: Record<Profile, number> = {
    CONFUSION: 0,
    PEUR: 0,
    CONTRÔLE: 0,
  };

  answerIndexes.forEach((optionIndex, questionIndex) => {
    const question = questions[questionIndex];
    const option = question?.options[optionIndex];
    if (!option) return;

    scores[option.profile] += option.weight;
  });

  const maxScore = Math.max(...Object.values(scores));

  const tiedProfiles = (Object.entries(scores) as [Profile, number][])
    .filter(([, score]) => score === maxScore)
    .map(([profile]) => profile);

  if (tiedProfiles.length === 1) return tiedProfiles[0];

  const lastAnswerProfile =
    questions[answerIndexes.length - 1]?.options[
      answerIndexes[answerIndexes.length - 1]
    ]?.profile;

  if (lastAnswerProfile && tiedProfiles.includes(lastAnswerProfile)) {
    return lastAnswerProfile;
  }

  return tiedProfiles[0] ?? "CONFUSION";
}

export function computeRadarScores(answerIndexes: number[]) {
  const totals: RadarScores = {
    clarte: 0,
    securite: 0,
    maitrise: 0,
    elan: 0,
    apaisement: 0,
  };

  answerIndexes.forEach((optionIndex, questionIndex) => {
    const question = questions[questionIndex];
    const option = question?.options[optionIndex];
    if (!option) return;

    totals.clarte += option.radar.clarte;
    totals.securite += option.radar.securite;
    totals.maitrise += option.radar.maitrise;
    totals.elan += option.radar.elan;
    totals.apaisement += option.radar.apaisement;
  });

  return totals;
}

export function getRadarData(answerIndexes: number[]) {
  const s = computeRadarScores(answerIndexes);

  return [
    { subject: "Clarté", value: s.clarte },
    { subject: "Sécurité", value: s.securite },
    { subject: "Maîtrise", value: s.maitrise },
    { subject: "Élan", value: s.elan },
    { subject: "Apaisement", value: s.apaisement },
  ];
}
