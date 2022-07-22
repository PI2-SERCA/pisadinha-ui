import React, { useEffect, useRef, memo } from 'react';
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

  console.log('teste');

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

  useEffect(() => {
    const canvas = canvasRef?.current;

    if (!canvas) return;

    const context = canvas.getContext('2d');

    if (!context) return;

    context.translate(canvas.width / 2, canvas.height / 2);

    for (let i = 0; i < requestResponse.points.length; i++) {
      const { length } = requestResponse.points;

      const [a, b] = requestResponse.points[i].split(';');
      const [c, d] = requestResponse.points[(i + 1) % length].split(';');

      drawCanvasLine(
        {
          x: applyValues(requestResponse.defaults, a) * 10,
          y: applyValues(requestResponse.defaults, b) * 10,
        },
        {
          x: applyValues(requestResponse.defaults, c) * 10,
          y: applyValues(requestResponse.defaults, d) * 10,
        },
      );
    }
  }, []);

  return (
    <div className={classes.root}>
      <canvas ref={canvasRef} className={classes.canvas} />
    </div>
  );
};

export default RoomMeasures;
