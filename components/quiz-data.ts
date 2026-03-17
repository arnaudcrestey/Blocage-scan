export type Profile = 'CONFUSION' | 'PEUR' | 'CONTRÔLE';

export type Question = {
  title: string;
  options: { label: string; profile: Profile }[];
};

export const questions: Question[] = [
  {
    title: 'Aujourd’hui, vous vous sentez plutôt :',
    options: [
      { label: 'Perdu', profile: 'CONFUSION' },
      { label: 'Bloqué', profile: 'PEUR' },
      { label: 'En contrôle', profile: 'CONTRÔLE' }
    ]
  },
  {
    title: 'Votre principale difficulté :',
    options: [
      { label: 'Manque de clarté', profile: 'CONFUSION' },
      { label: 'Peur d’agir', profile: 'PEUR' },
      { label: 'Trop de pression', profile: 'CONTRÔLE' }
    ]
  },
  {
    title: 'Face aux décisions, vous :',
    options: [
      { label: 'Hésitez', profile: 'CONFUSION' },
      { label: 'Évitez', profile: 'PEUR' },
      { label: 'Forcez', profile: 'CONTRÔLE' }
    ]
  }
];

export const profileDescriptions: Record<Profile, string> = {
  CONFUSION:
    'Vous avez beaucoup de possibilités, mais un manque de clarté vous empêche d’avancer.',
  PEUR: 'Vous savez ce que vous devez faire, mais la peur freine votre passage à l’action.',
  CONTRÔLE:
    'Vous avancez sous tension, avec une forte pression interne qui bloque votre fluidité.'
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

  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'CONFUSION') as Profile;
}
