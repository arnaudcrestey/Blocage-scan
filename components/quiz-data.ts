export type Profile = 'CONFUSION' | 'PEUR' | 'CONTRÔLE';

export type Question = {
  title: string;
  options: { label: string; profile: Profile }[];
};

export const questions: Question[] = [
  {
    title: "Quand vous pensez à avancer dans votre vie, vous ressentez surtout :",
    options: [
      {
        label: "Un flou… vous ne savez pas vraiment par où commencer",
        profile: "CONFUSION"
      },
      {
        label: "Une tension intérieure, comme un frein invisible",
        profile: "PEUR"
      },
      {
        label: "Une pression forte de devoir tout maîtriser",
        profile: "CONTRÔLE"
      }
    ]
  },
  {
    title: "Face à une décision importante, votre réaction naturelle est :",
    options: [
      {
        label: "Analyser encore et encore sans réussir à trancher",
        profile: "CONFUSION"
      },
      {
        label: "Reporter ou éviter pour ne pas vous tromper",
        profile: "PEUR"
      },
      {
        label: "Forcer une décision rapidement pour garder le contrôle",
        profile: "CONTRÔLE"
      }
    ]
  },
  {
    title: "Ce qui vous épuise le plus aujourd’hui :",
    options: [
      {
        label: "Le sentiment de ne pas avancer clairement",
        profile: "CONFUSION"
      },
      {
        label: "La peur des conséquences si vous changez",
        profile: "PEUR"
      },
      {
        label: "La pression constante que vous vous imposez",
        profile: "CONTRÔLE"
      }
    ]
  }
];

export const profileDescriptions: Record<Profile, string> = {
  CONFUSION:
    "Vous avez du potentiel et des idées, mais un manque de clarté vous maintient dans l’hésitation. Votre énergie se disperse, ce qui ralentit vos décisions et votre passage à l’action.",

  PEUR:
    "Vous percevez les bons choix, mais une peur profonde vous freine. Ce n’est pas un manque de capacité, mais un mécanisme de protection qui limite votre évolution.",

  CONTRÔLE:
    "Vous avancez avec exigence et intensité, mais une pression interne forte vous empêche de lâcher prise. Ce besoin de maîtrise devient paradoxalement un frein."
};

export function computeDominantProfile(answers: Profile[]): Profile {
  const scores: Record<Profile, number> = {
    CONFUSION: 0,
    PEUR: 0,
    CONTRÔLE: 0
  };

  answers.forEach((profile) => {
    scores[profile] += 1;
  });

  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "CONFUSION") as Profile;
}
