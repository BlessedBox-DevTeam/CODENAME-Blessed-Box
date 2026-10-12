export type BoxLabelInfo = {
  genderId: number;
  quantity: number;
  boxAgeId: number;
};

export type BoxLabelType = {
  getData: () => BoxLabelInfo;
};

export type NewTransactionBoxLabels = Partial<
  Record<'Male' | 'Female', Partial<Record<'2-4' | '5-9' | '10-14', number>>>
> & {
  Unlabeled?: { 'No age': number };
};

export type NewTransactionPayload = {
  boxLabels: NewTransactionBoxLabels;
};
