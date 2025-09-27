export type BoxLabelInfo = {
  selectedAge: '2-4' | '5-9' | '10-14';
  quantity: number;
  gender: number;
};

export type BoxLabelType = {
  getData: () => BoxLabelInfo;
};
