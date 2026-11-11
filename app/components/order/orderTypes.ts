import colors from '../../baseStyles/colors';

export type Gender = 'girl' | 'boy' | 'unlabeled';
export type AgeIndex = 0 | 1 | 2;
export type BoxKey = `${Gender}-${AgeIndex}`;
export type BoxValues = Record<BoxKey, number>;

export type GenderConfig = {
  key: Gender;
  label: string;
  title: string;
  color: string;
  backgroundColor: string;
  border: string;
  dimBorder: string;
  selectedBackground: string;
  buttonBackground: string;
  amountBackground: string;
  amountBorder: string;
};

export const GENDERS: GenderConfig[] = [
  {
    key: 'girl',
    label: 'GIRL',
    title: 'Girl',
    color: colors.dashboard.contribution.femaleText,
    backgroundColor: colors.dashboard.contribution.femaleBackground,
    border: colors.status.danger,
    dimBorder: colors.effects.depositDangerSurface,
    selectedBackground: colors.dashboard.contribution.femaleBackground,
    buttonBackground: colors.dashboard.contribution.femaleText,
    amountBackground: colors.dashboard.contribution.femaleBackground,
    amountBorder: colors.effects.depositDangerSurface,
  },
  {
    key: 'boy',
    label: 'BOY',
    title: 'Boy',
    color: colors.dashboard.contribution.maleText,
    backgroundColor: colors.dashboard.contribution.maleBackground,
    border: colors.brand.primary,
    dimBorder: colors.effects.greenBorderDim,
    selectedBackground: colors.dashboard.contribution.maleBackground,
    buttonBackground: colors.brand.primary,
    amountBackground: colors.dashboard.contribution.maleBackground,
    amountBorder: colors.brand.subtle,
  },
  {
    key: 'unlabeled',
    label: 'UNLABELED',
    title: 'Unlabeled',
    color: colors.dashboard.contribution.unlabeledText,
    backgroundColor: colors.dashboard.contribution.unlabeledBackground,
    border: colors.text.secondary,
    dimBorder: colors.effects.gray,
    selectedBackground: colors.dashboard.contribution.unlabeledBackground,
    buttonBackground: colors.text.secondary,
    amountBackground: colors.dashboard.contribution.unlabeledBackground,
    amountBorder: colors.surface.neutral,
  },
];

export const AGE_LABELS = ['2–4', '5–9', '10–14'] as const;

export const INITIAL_BOX_VALUES: BoxValues = {
  'girl-0': 0,
  'girl-1': 0,
  'girl-2': 0,
  'boy-0': 0,
  'boy-1': 0,
  'boy-2': 0,
  'unlabeled-0': 0,
  'unlabeled-1': 0,
  'unlabeled-2': 0,
};
