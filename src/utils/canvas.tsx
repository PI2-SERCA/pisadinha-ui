import React from 'react';
import { Text, Label, Tag } from 'react-konva';

export const LINE_WIDTH = 5;

export const MEASURE_PROPORTION = 50;

export const getCanvasWidth = () =>
  window.screen.availWidth > 900 ? 900 : window.screen.availWidth;

export const getCanvasHeight = () =>
  window.screen.availHeight > 500 ? 500 : window.screen.availHeight;

export const applyValues = (values: Record<string, number>, key: string) =>
  values[key] || Number(key);

export const drawTexts = (
  segments: Record<string, string[]>,
  defaults?: Record<string, number>
) =>
  Object.entries(segments).map(([key, value]) => {
    let midx: number;
    let midy: number;

    if (defaults) {
      const [x1, y1] = value[0]
        .split(';')
        .map((v) => applyValues(defaults, v) * MEASURE_PROPORTION);
      const [x2, y2] = value[1]
        .split(';')
        .map((v) => applyValues(defaults, v) * MEASURE_PROPORTION);

      midx = (x1 + x2) / 2 - 10;
      midy = (y1 + y2) / 2 - 13;
    } else {
      const [x1, y1] = value[0]
        .split(';')
        .map((v) => Number(v) * MEASURE_PROPORTION);
      const [x2, y2] = value[1]
        .split(';')
        .map((v) => Number(v) * MEASURE_PROPORTION);

      midx = (x1 + x2) / 2 - 10;
      midy = (y1 + y2) / 2 - 13;
    }

    return (
      <Label key={key} x={midx} y={midy}>
        <Tag fill="white" stroke="black" />
        <Text text={key.toUpperCase()} fontSize={18} padding={4} />
      </Label>
    );
  });
