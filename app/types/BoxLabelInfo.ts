export type BoxLabelInfo = {
  selectedAge: '2-4' | '5-9' | '10-14' | false;
  quantity: number;
  gender: number | false;
};

export type BoxLabelType = {
  getData: () => BoxLabelInfo;
};
