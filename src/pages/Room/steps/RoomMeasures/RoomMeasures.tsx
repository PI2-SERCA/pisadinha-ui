import React, { SetStateAction, Dispatch } from 'react';
import { Stage, Layer, Shape, Text, Label, Tag } from 'react-konva';

import Konva from 'konva/lib/index-types';

import { TextField, Box, Typography } from '@material-ui/core';

import { parseStrToFloat } from '../../../../utils/number';
import NumberFormatCustom from '../../../../components/NumberInputField';

import useStyles from './room-measures-styles';

import { RequestResponse } from '../../../../types';

interface RoomMeasuresProps {
  requestResponse: RequestResponse;
  roomMeasures: Record<string, number>;
  roomMeasuresErrors: Record<string, string>;
  setRoomMeasures: Dispatch<SetStateAction<Record<string, number>>>;
}

const LINE_WIDTH = 5;

const applyValues = (values: Record<string, number>, key: string) =>
  values[key] || Number(key);

export const RoomMeasures: React.FC<RoomMeasuresProps> = ({
  roomMeasures,
  setRoomMeasures,
  requestResponse,
  roomMeasuresErrors,
}) => {
  const classes = useStyles();

  const getCanvasWidth = () =>
    window.screen.availWidth > 900 ? 900 : window.screen.availWidth;

  const getCanvasHeight = () =>
    window.screen.availHeight > 500 ? 500 : window.screen.availHeight;

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

  const drawTexts = () =>
    Object.entries(requestResponse.segments).map(([key, value]) => {
      const [x1, y1] = value[0]
        .split(';')
        .map((v) => applyValues(requestResponse.defaults, v) * 50);
      const [x2, y2] = value[1]
        .split(';')
        .map((v) => applyValues(requestResponse.defaults, v) * 50);

      const midx = (x1 + x2) / 2 - 10;
      const midy = (y1 + y2) / 2 - 13;

      return (
        <Label key={key} x={midx} y={midy}>
          <Tag fill="white" stroke="black" />
          <Text text={key.toUpperCase()} fontSize={18} padding={4} />
        </Label>
      );
    });

  return (
    <>
      <Stage width={getCanvasWidth()} height={getCanvasHeight()}>
        <Layer offsetX={-LINE_WIDTH - 10} offsetY={-LINE_WIDTH - 13}>
          <Shape
            sceneFunc={drawShape}
            stroke="black"
            strokeWidth={LINE_WIDTH}
          />

          {drawTexts()}
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
