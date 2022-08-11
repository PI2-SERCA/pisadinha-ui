import React, { SetStateAction, Dispatch } from 'react';
import { Stage, Layer, Shape } from 'react-konva';

import Konva from 'konva/lib/index-types';

import { TextField, Box, Typography } from '@material-ui/core';

import { parseStrToFloat } from '../../utils/number';
import {
  LINE_WIDTH,
  drawShape,
  drawTexts,
  getCanvasWidth,
  getCanvasHeight,
} from '../../utils/canvas';
import NumberFormatCustom from '../NumberInputField';

import useStyles from './cast-measures-styles';

import { Cast } from '../../types';

interface CastMeasuresProps {
  requestResponse: Cast;
  castMeasures: Record<string, number>;
  castMeasuresErrors: Record<string, string>;
  setCastMeasures: Dispatch<SetStateAction<Record<string, number>>>;
}

export const CastMeasures: React.FC<CastMeasuresProps> = ({
  castMeasures,
  setCastMeasures,
  requestResponse,
  castMeasuresErrors,
}) => {
  const classes = useStyles();

  return (
    <>
      <Stage width={getCanvasWidth()} height={getCanvasHeight()}>
        <Layer offsetX={-LINE_WIDTH - 10} offsetY={-LINE_WIDTH - 13}>
          <Shape
            stroke="black"
            strokeWidth={LINE_WIDTH}
            sceneFunc={(context: Konva.Context, shape: Konva.Shape) =>
              drawShape(context, shape, requestResponse)
            }
          />

          {drawTexts(requestResponse.segments, requestResponse.defaults)}
        </Layer>
      </Stage>

      <Typography variant="body1">Insira as medidas correspondentes</Typography>

      <Box className={classes.inputBox}>
        {Object.keys(requestResponse.segments).map((key) => (
          <TextField
            key={key}
            required
            label={key.toUpperCase()}
            placeholder="Tamanho em metros"
            style={{ marginBottom: '24px' }}
            value={castMeasures[key]}
            error={!!castMeasuresErrors[key]}
            helperText={castMeasuresErrors[key]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setCastMeasures((prev) => ({
                ...prev,
                [key]: parseStrToFloat(e.target.value),
              }));
            }}
            InputProps={{
              inputComponent: NumberFormatCustom as React.FC,
            }}
          />
        ))}
      </Box>
    </>
  );
};

export default CastMeasures;
