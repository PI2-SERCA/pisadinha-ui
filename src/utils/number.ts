import { applyValues } from './canvas';

export const MAX_CERAMIC_SIZE = 50; // cm

export const parseStrToFloat = (str: string) =>
  parseFloat(str.replace(',', '.'));

export const getPolygonPoints = (
  points: string[],
  measures: Record<string, number>
) =>
  points.map((point) =>
    point.split(';').map((value) => applyValues(measures, value))
  );

export default {
  parseStrToFloat,
};
