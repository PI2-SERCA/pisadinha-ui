export const MAX_CERAMIC_SIZE = 50; // cm

export const parseStrToFloat = (str: string) =>
  parseFloat(str.replace(',', '.'));

export default {
  parseStrToFloat,
};
