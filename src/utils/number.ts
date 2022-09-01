import { applyValues } from './canvas';

export const MAX_CERAMIC_SIZE = 50; // cm

export const parseStrToFloat = (str: string) =>
  parseFloat(str.replace(',', '.'));

export const centimetersToMeters = (value: number | null) =>
  value && value / 100;

export const getPolygonPoints = (
  points: string[],
  measures: Record<string, number>,
  conversionFunc = (value: number | null) => value
) =>
  points.map((point) =>
    point
      .split(';')
      .map((value) => conversionFunc(applyValues(measures, value)))
  );
