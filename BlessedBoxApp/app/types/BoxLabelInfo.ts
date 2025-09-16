export type BoxLabelInfo = {
  selectedAge: '2-4' | '5-9' | '10-14';
  quantity: number;
  gender?: string; // si quieres incluir género
};

export type BoxLabelType = {
  getData: () => BoxLabelInfo;
};
