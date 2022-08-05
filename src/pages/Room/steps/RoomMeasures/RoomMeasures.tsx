import React, { SetStateAction, Dispatch } from 'react';
import { Stage, Layer, Shape } from 'react-konva';

import Konva from 'konva/lib/index-types';

import { TextField, Box, Typography } from '@material-ui/core';

import { parseStrToFloat } from '../../../../utils/number';
import {
  LINE_WIDTH,
  applyValues,
  drawTexts,
  getCanvasWidth,
  getCanvasHeight,
} from '../../../../utils/canvas';
import NumberFormatCustom from '../../../../components/NumberInputField';

import useStyles from './room-measures-styles';

import { RequestResponse } from '../../../../types';

interface RoomMeasuresProps {
  requestResponse: RequestResponse;
  roomMeasures: Record<string, number>;
  roomMeasuresErrors: Record<string, string>;
  setRoomMeasures: Dispatch<SetStateAction<Record<string, number>>>;
}

export const RoomMeasures: React.FC<RoomMeasuresProps> = ({
  roomMeasures,
  setRoomMeasures,
  requestResponse,
  roomMeasuresErrors,
}) => {
  const classes = useStyles();

  const drawShape = (context: Konva.Context, shape: Konva.Shape) => {
    context.beginPath();

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
    <>
      <Stage width={getCanvasWidth()} height={getCanvasHeight()}>
        <Layer offsetX={-LINE_WIDTH - 10} offsetY={-LINE_WIDTH - 13}>
          <Shape
            sceneFunc={drawShape}
            stroke="black"
            strokeWidth={LINE_WIDTH}
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
            value={roomMeasures[key]}
            error={!!roomMeasuresErrors[key]}
            helperText={roomMeasuresErrors[key]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setRoomMeasures((prev) => ({
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

export default RoomMeasures;
