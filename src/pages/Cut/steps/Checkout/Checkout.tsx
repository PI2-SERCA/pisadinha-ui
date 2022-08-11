import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';

import { Box, TextField } from '@material-ui/core';

import Konva from 'konva/lib/index-types';
import { Stage, Layer, Shape, Rect } from 'react-konva';
import {
  LINE_WIDTH,
  drawShape,
  applyValues,
  getCanvasWidth,
  getCanvasHeight,
  MEASURE_PROPORTION,
} from '../../../../utils/canvas';

import useStyles from './checkout-styles';

import { Cast } from '../../../../types';

interface CheckoutProps {
  requestResponse: Cast;
  cutPosition: { x: number; y: number };
  setCutPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
  ceramicWidth: number;
  ceramicHeight: number;
}

export const Checkout: React.FC<CheckoutProps> = ({
  requestResponse,
  cutPosition,
  setCutPosition,
  ceramicWidth,
  ceramicHeight,
}) => {
  const classes = useStyles();

  const [cutRepetitions, setCutRepetitions] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [maxCoordinateValues, setMaxCoordinateValues] = useState({
    x: 0,
    y: 0,
  });

  const changePosition = (axis: 'x' | 'y', value: string) => {
    let errorMsg = '';
    const newValue = parseInt(value, 10);

    if (newValue > (axis === 'x' ? ceramicWidth : ceramicHeight)) {
      errorMsg = 'O valor não pode ultrapassar o tamanho da cerâmica';
    } else {
      setCutPosition((prev) => ({
        ...prev,
        [axis]: Number.isNaN(newValue) ? '' : newValue,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [axis]: errorMsg,
    }));
  };

  useEffect(() => {
    let maxY = 0;
    let maxX = 0;

    requestResponse.points.forEach((point) => {
      const [strX, strY] = point.split(';');
      let [x, y] = [Number(strX), Number(strY)];

      x = Number.isNaN(x) ? applyValues(requestResponse.defaults, strX) : x;
      y = Number.isNaN(y) ? applyValues(requestResponse.defaults, strY) : y;

      if (x > maxX) maxX = x;

      if (y > maxY) maxY = y;
    });

    setMaxCoordinateValues({ x: maxY, y: maxX });
  }, [requestResponse]);

  return (
    <>
      <Box style={{ margin: '16px 0' }}>
        <TextField
          type="number"
          variant="outlined"
          value={cutRepetitions}
          label="Quantidade de repetições do corte"
          InputLabelProps={{ shrink: true }}
          style={{ minWidth: 300 }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCutRepetitions(parseInt(e.target.value, 10))
          }
        />

        <TextField
          type="number"
          variant="outlined"
          value={cutPosition.x}
          label="Posicionamento corte X"
          error={!!errors.x}
          helperText={errors.x}
          InputLabelProps={{ shrink: true }}
          style={{ minWidth: 150, marginLeft: 16 }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            changePosition('x', e.target.value)
          }
        />

        <TextField
          type="number"
          variant="outlined"
          value={cutPosition.y}
          label="Posicionamento corte Y"
          error={!!errors.y}
          helperText={errors.y}
          InputLabelProps={{ shrink: true }}
          style={{ minWidth: 150, marginLeft: 16 }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            changePosition('y', e.target.value)
          }
        />
      </Box>

      <Box className={classes.cutList}>
        <Stage width={getCanvasWidth()} height={getCanvasHeight(350)}>
          <Layer offsetX={-LINE_WIDTH - 10} offsetY={-LINE_WIDTH - 13}>
            <Rect
              x={0}
              y={0}
              width={ceramicWidth * MEASURE_PROPORTION}
              height={ceramicHeight * MEASURE_PROPORTION}
              stroke="black"
              shadowBlur={5}
              strokeWidth={LINE_WIDTH}
            />
          </Layer>

          <Layer
            offsetX={-LINE_WIDTH - 10 - cutPosition.x * MEASURE_PROPORTION}
            offsetY={-LINE_WIDTH - 13 - cutPosition.y * MEASURE_PROPORTION}
          >
            <Shape
              stroke="red"
              strokeWidth={LINE_WIDTH}
              sceneFunc={(context: Konva.Context, shape: Konva.Shape) =>
                drawShape(context, shape, requestResponse)
              }
            />
          </Layer>
        </Stage>
      </Box>
    </>
  );
};

export default Checkout;
