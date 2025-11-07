export type BoxLabelInfo = {
  genderId: number | false;
  quantity: number;
  boxAgeId: number | false;
};

export type BoxLabelType = {
  getData: () => BoxLabelInfo;
};
