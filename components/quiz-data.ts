export type Profile = "CONFUSION" | "PEUR" | "CONTRÔLE";

export type Question = {
  title: string;
  options: {
    label: string;
    profile: Profile;
    radar: {
      clarte: number;
      securite: number;
      maitrise: number;
    };
  }[];
};

export const questions: Question[] = [
  {
    title: "Quand vous pensez à avancer dans votre vie, vous ressentez surtout :",
    options: [
      {
        label: "Un flou… vous ne savez pas vraiment par où commencer",
        profile: "CONFUSION",
        radar: { clarte: 3, securite: 1, maitrise: 0 },
      },
      {
        label: "Une tension intérieure, comme un frein invisible",
        profile: "PEUR",
        radar: { clarte: 1, securite: 3, maitrise: 1 },
      },
      {
        label: "Une pression forte de devoir tout maîtriser",
        profile: "CONTRÔLE",
        radar: { clarte: 0, securite: 1, maitrise: 3 },
      },
    ],
  },
  {
    title: "Face à une décision importante, votre réaction naturelle est :",
    options: [
      {
        label: "Analyser encore et encore sans réussir à trancher",
        profile: "CONFUSION",
        radar: { clarte: 3, securite: 1, maitrise: 1 },
      },
      {
        label: "Reporter ou éviter pour ne pas vous tromper",
        profile: "PEUR",
        radar: { clarte: 0, securite: 3, maitrise: 0 },
      },
      {
        label: "Forcer une décision rapidement pour garder le contrôle",
        profile: "CONTRÔLE",
        radar: { clarte: 1, securite: 0, maitrise: 3 },
      },
    ],
  },
  {
    title: "Ce qui vous épuise le plus aujourd’hui :",
    options: [
      {
        label: "Le sentiment de ne pas avancer clairement",
        profile: "CONFUSION",
        radar: { clarte: 3, securite: 0, maitrise: 1 },
      },
      {
        label: "La peur des conséquences si vous changez",
        profile: "PEUR",
        radar: { clarte: 0, securite: 3, maitrise: 0 },
      },
      {
        label: "La pression constante que vous vous imposez",
        profile: "CONTRÔLE",
        radar: { clarte: 0, securite: 1, maitrise: 3 },
      },
    ],
  },
];

export const profileDescriptions: Record<Profile, string> = {
  CONFUSION:
    "Vous avez du potentiel et des idées, mais un manque de clarté vous maintient dans l’hésitation. Votre énergie se disperse, ce qui ralentit vos décisions et votre passage à l’action.",

  PEUR:
    "Vous percevez les bons choix, mais une peur profonde vous freine. Ce n’est pas un manque de capacité, mais un mécanisme de protection qui limite votre évolution.",

  CONTRÔLE:
    "Vous avancez avec exigence et intensité, mais une pression interne forte vous empêche de lâcher prise. Ce besoin de maîtrise devient paradoxalement un frein.",
};

export function computeDominantProfile(answers: Profile[]): Profile {
  const scores: Record<Profile, number> = {
    CONFUSION: 0,
    PEUR: 0,
    CONTRÔLE: 0,
  };

  answers.forEach((profile) => {
    scores[profile] += 1;
  });

  const maxScore = Math.max(...Object.values(scores));
  const tiedProfiles = (Object.entries(scores) as [Profile, number][])
    .filter(([, value]) => value === maxScore)
    .map(([profile]) => profile);

  if (tiedProfiles.length === 1) {
    return tiedProfiles[0];
  }

  // départage intelligent :
  // si égalité, on donne priorité à la dernière réponse
  // car elle reflète souvent le ressenti le plus conscient du moment
  const lastAnswer = answers[answers.length - 1];
  if (lastAnswer && tiedProfiles.includes(lastAnswer)) {
    return lastAnswer;
  }

  // sécurité
  return tiedProfiles[0] ?? "CONFUSION";
}

export function computeRadarScores(answers: number[]) {
  const totals = {
    clarte: 0,
    securite: 0,
    maitrise: 0,
  };

  answers.forEach((optionIndex, questionIndex) => {
    const question = questions[questionIndex];
    const option = question?.options[optionIndex];

    if (!option) return;

    totals.clarte += option.radar.clarte;
    totals.securite += option.radar.securite;
    totals.maitrise += option.radar.maitrise;
  });

  return totals;
}

export function getRadarData(answers: number[]) {
  const scores = computeRadarScores(answers);

  return [
    { subject: "Clarté", value: scores.clarte },
    { subject: "Sécurité", value: scores.securite },
    { subject: "Maîtrise", value: scores.maitrise },
  ];
}

export function getProfileFromIndexes(answerIndexes: number[]): Profile[] {
  return answerIndexes.map((optionIndex, questionIndex) => {
    const question = questions[questionIndex];
    const option = question?.options[optionIndex];
    return option?.profile ?? "CONFUSION";
  });
}
