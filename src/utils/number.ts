export const parseStrToFloat = (str: string) =>
  parseFloat(str.replace(',', '.'));

export default {
  parseStrToFloat,
};
