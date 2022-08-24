import React, { useState } from 'react';

import { Box, TextField } from '@material-ui/core';

import Konva from 'konva/lib/index-types';
import { Stage, Layer, Shape, Rect } from 'react-konva';
import {
  LINE_WIDTH,
  drawShape,
  getCanvasWidth,
  getCanvasHeight,
} from '../../../../utils/canvas';

import useStyles from './checkout-styles';

import { Cast } from '../../../../types';

interface CheckoutProps {
  requestResponse: Cast;
  ceramicWidth: number;
  ceramicHeight: number;
}

const MEASURE_PROPORTION = 10;

export const Checkout: React.FC<CheckoutProps> = ({
  requestResponse,
  ceramicWidth,
  ceramicHeight,
}) => {
  const classes = useStyles();

  const [cutRepetitions, setCutRepetitions] = useState(1);

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
      </Box>

      <Box className={classes.cutList}>
        <Stage width={getCanvasWidth()} height={getCanvasHeight(530)}>
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

          <Layer>
            <Shape
              stroke="red"
              strokeWidth={LINE_WIDTH}
              sceneFunc={(context: Konva.Context, shape: Konva.Shape) =>
                drawShape(context, shape, requestResponse, 10, true)
              }
            />
          </Layer>
        </Stage>
      </Box>
    </>
  );
};

export default Checkout;
