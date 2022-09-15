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
  DEFAULT_MEASURE_PROPORTION,
} from '../../utils/canvas';
import NumberFormatCustom from '../NumberInputField';

import useStyles from './cast-measures-styles';

import { Cast } from '../../types';

interface CastMeasuresProps {
  cast: Cast;
  measure: 'cm' | 'm';
  proportion?: number;
  maxCanvasHeight?: number;
  castMeasures: Record<string, number>;
  castMeasuresErrors: Record<string, string>;
  setCastMeasures: Dispatch<SetStateAction<Record<string, number>>>;
}

export const CastMeasures: React.FC<CastMeasuresProps> = ({
  cast,
  measure,
  proportion,
  castMeasures,
  maxCanvasHeight,
  setCastMeasures,
  castMeasuresErrors,
}) => {
  const classes = useStyles();

  return (
    <>
      <Stage width={getCanvasWidth()} height={getCanvasHeight(maxCanvasHeight)}>
        <Layer offsetX={-LINE_WIDTH - 10} offsetY={-LINE_WIDTH - 13}>
          <Shape
            stroke="black"
            strokeWidth={LINE_WIDTH}
            sceneFunc={(context: Konva.Context, shape: Konva.Shape) =>
              drawShape(context, shape, cast, proportion)
            }
          />

          {drawTexts(cast.segments, cast.defaults, proportion)}
        </Layer>
      </Stage>

      <Typography variant="body1">Insira as medidas correspondentes</Typography>

      <Box className={classes.inputBox}>
        {Object.keys(cast.segments).map((key) => (
          <TextField
            key={key}
            required
            label={`${key.toUpperCase()} (${measure})`}
            placeholder={`Tamanho em ${
              measure === 'm' ? 'metros' : 'centímetros'
            }`}
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

CastMeasures.defaultProps = {
  maxCanvasHeight: 900,
  proportion: DEFAULT_MEASURE_PROPORTION,
};

export default CastMeasures;
