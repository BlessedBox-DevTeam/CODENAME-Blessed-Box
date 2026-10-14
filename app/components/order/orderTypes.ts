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
    color: colors.orderGirlText,
    border: colors.orderGirlBorder,
    dimBorder: colors.orderGirlBorderDim,
    selectedBackground: colors.orderGirlSelected,
    buttonBackground: colors.orderGirlButton,
    amountBackground: colors.orderGirlAmount,
    amountBorder: colors.orderGirlAmountBorder,
  },
  {
    key: 'boy',
    label: 'BOY',
    title: 'Boy',
    color: colors.orderBoyText,
    border: colors.orderBoyBorder,
    dimBorder: colors.orderBoyBorderDim,
    selectedBackground: colors.orderBoySelected,
    buttonBackground: colors.orderBoyButton,
    amountBackground: colors.orderBoyAmount,
    amountBorder: colors.orderBoyAmountBorder,
  },
  {
    key: 'unlabeled',
    label: 'UNLABELED',
    title: 'Unlabeled',
    color: colors.orderUnlabeledText,
    border: colors.orderUnlabeledBorder,
    dimBorder: colors.orderUnlabeledBorderDim,
    selectedBackground: colors.orderUnlabeledSelected,
    buttonBackground: colors.orderUnlabeledButton,
    amountBackground: colors.orderUnlabeledAmount,
    amountBorder: colors.orderUnlabeledAmountBorder,
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
