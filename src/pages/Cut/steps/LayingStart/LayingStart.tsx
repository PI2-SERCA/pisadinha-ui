import React, { Dispatch, useState } from 'react';
import { Stage, Layer, Shape } from 'react-konva';

import Konva from 'konva/lib/index-types';

import {
  Box,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
  CircularProgress,
} from '@material-ui/core';

import {
  drawTexts,
  LINE_WIDTH,
  applyValues,
  getCanvasWidth,
  getCanvasHeight,
} from '../../../../utils/canvas';

import useStyles from './laying-start-styles';

import { RequestResponse } from '../../../../types';

interface LayingStartProps {
  requestResponse: RequestResponse;
  selectedLayingStart: string;
  setSelectedLayingStart: Dispatch<string>;
}

interface PositionData {
  [key: string]: {
    full: number;
    uniqueCuts: [[any[], number]];
  };
}

const State: PositionData = {
  A: {
    full: 20,
    uniqueCuts: [[[], 5]],
  },
  B: {
    full: 40,
    uniqueCuts: [[[], 0]],
  },
  C: {
    full: 10,
    uniqueCuts: [[[], 32]],
  },
  D: {
    full: 4,
    uniqueCuts: [[[], 67]],
  },
  E: {
    full: 9,
    uniqueCuts: [[[], 40]],
  },
};

const corners: {
  segments: Record<string, string[]>;
} = {
  segments: {
    A: ['0;0', '0;0'],
    B: ['0;4', '0;4'],
    C: ['2;7', '2;7'],
    D: ['5;7', '5;7'],
    E: ['5;0', '5;0'],
  },
};

function calculateAllCuts(uniqueCuts: [[any[], number]]): number {
  let total = 0;

  uniqueCuts.forEach((cut) => {
    total += cut[1];
  });

  return total;
}

export const LayingStart: React.FC<LayingStartProps> = ({
  requestResponse,
  selectedLayingStart,
  setSelectedLayingStart,
}) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [positionData, setPositionData] = useState<PositionData>(State);

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

  const handleStartChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const key = e.target.value as string;

    setLoading(true);

    setTimeout(() => setLoading(false), 1000);

    setSelectedLayingStart(key);

    if (!positionData[key]) {
      setPositionData((prev) => ({
        ...prev,
        [key]: { full: 0, uniqueCuts: [[[], 0]] },
      }));
    }
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

          {drawTexts(corners.segments)}
        </Layer>
      </Stage>

      <Typography variant="body1">
        Selecione o local de início do assentamento
      </Typography>

      <Box className={classes.inputBox}>
        <FormControl>
          <InputLabel id="select-helper-label">Início</InputLabel>

          <Select
            value={selectedLayingStart}
            labelId="select-helper-label"
            style={{ minWidth: 150 }}
            onChange={handleStartChange}
          >
            {Object.keys(corners.segments).map((key) => (
              <MenuItem key={key} value={key.toUpperCase()}>
                {key.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Box>
            <TextField
              disabled
              value={positionData[selectedLayingStart]?.full}
              label="Cerâmicas completas"
            />

            <TextField
              disabled
              value={calculateAllCuts(
                positionData[selectedLayingStart]?.uniqueCuts || []
              )}
              style={{ marginLeft: 32 }}
              label="Cerâmicas cortadas"
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default LayingStart;
