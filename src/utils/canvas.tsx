import React from 'react';
import { Text, Label, Tag } from 'react-konva';

import Konva from 'konva/lib/index-types';
import { Cast } from '../types';

export const LINE_WIDTH = 5;

export const MEASURE_PROPORTION = 50;

export const getCanvasWidth = (maxValue = 900) =>
  window.screen.availWidth > maxValue ? maxValue : window.screen.availWidth;

export const getCanvasHeight = (maxValue = 500) =>
  window.screen.availHeight > maxValue ? maxValue : window.screen.availHeight;

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

export const drawShape = (
  context: Konva.Context,
  shape: Konva.Shape,
  cast: Cast
) => {
  context.beginPath();

  for (let i = 0; i < cast.points.length; i += 1) {
    const { length } = cast.points;

    const [a, b] = cast.points[i].split(';');
    const [c, d] = cast.points[(i + 1) % length].split(';');

    const startX = applyValues(cast.defaults, a) * MEASURE_PROPORTION;
    const startY = applyValues(cast.defaults, b) * MEASURE_PROPORTION;

    const endX = applyValues(cast.defaults, c) * MEASURE_PROPORTION;
    const endY = applyValues(cast.defaults, d) * MEASURE_PROPORTION;

    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
  }

  context.closePath();

  context.fillStrokeShape(shape);
};
