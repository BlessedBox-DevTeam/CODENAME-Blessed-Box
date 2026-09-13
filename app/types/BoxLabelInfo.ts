export type BoxLabelInfo = {
  genderId: number;
  quantity: number;
  boxAgeId: number;
};

export type BoxLabelType = {
  getData: () => BoxLabelInfo;
};
