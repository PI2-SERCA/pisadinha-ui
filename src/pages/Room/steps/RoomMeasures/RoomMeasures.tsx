import React, { useRef } from 'react';
import { Stage, Layer, Shape } from 'react-konva';

// import { TextField } from '@material-ui/core';

// import NumberFormatCustom from '../../../../components/NumberInputField';

import useStyles from './room-measures-styles';

interface Coordinate {
  x: number;
  y: number;
}

interface RoomMeasuresProps {
  activeStep: number;
}

const LINE_WIDTH = 5;

interface RequestResponse {
  name: string;
  points: string[];
  defaults: Record<string, number>;
  segments: Record<string, string[]>;
}

const requestResponse: RequestResponse = {
  points: ['0;0', '0;a', 'b;a', 'b;c', 'd;c', 'd;0'],
  defaults: {
    a: 4,
    b: 2,
    c: 7,
    d: 5,
  },
  segments: {
    a: ['0;0', '0;a'],
    b: ['0;a', 'b;a'],
    c: ['d;c', 'd;0'],
    d: ['0;0', 'd;0'],
  },
  name: 'Formato em L',
};

const applyValues = (values: Record<string, number>, key: string) => values[key] || Number(key);

export const RoomMeasures: React.FC = () => {
  const classes = useStyles();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawCanvasLine = (srcCoord: Coordinate, destCoord: Coordinate): void => {
    const canvas = canvasRef?.current;

    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (!context) return;

    context.beginPath();
    context.strokeStyle = '#000000';
    context.lineWidth = LINE_WIDTH;
    context.moveTo(srcCoord.x, srcCoord.y);
    context.lineTo(destCoord.x, destCoord.y);
    context.stroke();
  };

  const getCanvasWidth = () => (window.screen.availWidth > 900 ? 900 : window.screen.availWidth);

  const getCanvasHeight = () => (window.screen.availHeight > 500 ? 500 : window.screen.availHeight);

  const drawShape = (context: any, shape: any) => {
    context.beginPath();

    context.translate(LINE_WIDTH, LINE_WIDTH);

    for (let i = 0; i < requestResponse.points.length; i += 1) {
      const { length } = requestResponse.points;

      const [a, b] = requestResponse.points[i].split(';');
      const [c, d] = requestResponse.points[(i + 1) % length].split(';');

      const startX = applyValues(requestResponse.defaults, a) * 50;
      const startY = applyValues(requestResponse.defaults, b) * 50;

      const endX = applyValues(requestResponse.defaults, c) * 50;
      const endY = applyValues(requestResponse.defaults, d) * 50;

      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
    }

    context.closePath();

    context.fillStrokeShape(shape);
  };

  return (
    <Stage width={getCanvasWidth()} height={getCanvasHeight()}>
      <Layer>
        <Shape
          sceneFunc={drawShape}
          stroke="black"
          strokeWidth={LINE_WIDTH}
        />
      </Layer>
    </Stage>
  );
};

export default RoomMeasures;
