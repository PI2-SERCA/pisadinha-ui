import React, { Dispatch, useCallback, useEffect, useState } from 'react';
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
  FormHelperText,
  CircularProgress,
} from '@material-ui/core';

import { toast } from 'react-toastify';
import {
  LINE_WIDTH,
  drawTexts,
  drawShape,
  getCanvasWidth,
  getCanvasHeight,
  applyValues,
} from '../../../../utils/canvas';

import useStyles from './laying-start-styles';

import { Cast, Cut } from '../../../../types';
import APIAdapter from '../../../../services/api';
import {
  centimetersToMeters,
  getPolygonPoints,
} from '../../../../utils/number';

interface LayingStartProps {
  room: Cast;
  spacing: number | null;
  layingStartValid: boolean;
  selectedLayingStart: string;
  ceramicWidth: number | null;
  ceramicHeight: number | null;
  roomMeasures: Record<string, number>;
  setSelectedLayingStart: Dispatch<string>;
  positionData: PositionData;
  setPositionData: React.Dispatch<React.SetStateAction<PositionData>>;
}

interface PositionData {
  [key: string]: {
    full: number;
    cuts: Cut[];
  };
}

export const LayingStart: React.FC<LayingStartProps> = ({
  room,
  spacing,
  positionData,
  setPositionData,
  ceramicWidth,
  ceramicHeight,
  roomMeasures,
  layingStartValid,
  selectedLayingStart,
  setSelectedLayingStart,
}) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [loadingPosition, setLoadingPosition] = useState(false);
  const [corners, setCorners] = useState<Record<string, string[]>>({});
  const [cornersIndexes, setcornersIndexes] = useState<Record<string, number>>(
    {}
  );

  const fetchPositionData = async (
    key: string
  ): Promise<PositionData['key'] | null> => {
    if (positionData[key]) return null;

    try {
      const apiAdapter = new APIAdapter();

      setLoadingPosition(true);

      const points = getPolygonPoints(room.points, roomMeasures);

      const response: { floor_laying: { full: number; cuts: Cut[] } } =
        await apiAdapter.get('floor-laying', {
          params: {
            points: JSON.stringify(points),
            corner: cornersIndexes[key],
            ceramic_data: JSON.stringify({
              spacing: centimetersToMeters(spacing),
              width: centimetersToMeters(ceramicWidth),
              height: centimetersToMeters(ceramicHeight),
            }),
          },
        });

      return response.floor_laying;
    } catch {
      toast.error('Não foi possível obter os dados desse ponto de início');

      return { full: 0, cuts: [] };
    } finally {
      setLoadingPosition(false);
    }
  };

  const handleStartChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const key = e.target.value as string;

    fetchPositionData(key).then((data) => {
      setSelectedLayingStart(key);

      if (data !== null) {
        setPositionData((prev) => ({
          ...prev,
          [key]: {
            ...data,
            cuts: data.cuts.map((item, idx) => ({ ...item, id: `cut-${idx}` })),
          },
        }));
      }
    });
  };

  const fetchCorners = useCallback(async () => {
    try {
      const apiAdapter = new APIAdapter();

      setLoading(true);

      const points = getPolygonPoints(room.points, roomMeasures);

      const response: { corners: number[] } = await apiAdapter.get('corners', {
        params: { points: JSON.stringify(points) },
      });

      const newCorners: Record<string, string[]> = {};
      const newCornersIndexes: Record<string, number> = {};

      const alphabet = Array.from(Array(26)).map((_, i) =>
        String.fromCharCode(i + 65)
      );

      response.corners.forEach((cornerIdx, idx) => {
        const point = room.points[cornerIdx];
        // we should use the room default measures to draw properly in the canvas
        const [x, y] = point
          .split(';')
          .map((key) => applyValues(room.defaults, key));

        newCornersIndexes[alphabet[idx]] = cornerIdx;
        newCorners[alphabet[idx]] = [`${x};${y}`, `${x};${y}`];
      });

      setCorners(newCorners);
      setcornersIndexes(newCornersIndexes);
    } catch {
      toast.error(
        'Não foi possível obter os pontos de início de assentamento.'
      );
    } finally {
      setLoading(false);
    }
  }, [room, roomMeasures, setCorners, setLoading]);

  const calcNumberOfCuts = () => {
    let count = 0;

    positionData[selectedLayingStart]?.cuts.forEach((cut) => {
      count += cut.quantity;
    });

    return count;
  };

  useEffect(() => {
    fetchCorners();
  }, [fetchCorners]);

  if (loading) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Stage width={getCanvasWidth()} height={getCanvasHeight(400)}>
        <Layer offsetX={-LINE_WIDTH - 10} offsetY={-LINE_WIDTH - 13}>
          <Shape
            stroke="black"
            strokeWidth={LINE_WIDTH}
            sceneFunc={(context: Konva.Context, shape: Konva.Shape) =>
              drawShape(context, shape, room)
            }
          />

          {drawTexts(corners)}
        </Layer>
      </Stage>

      <Typography variant="body1">
        Selecione o local de início do assentamento
      </Typography>

      <Box className={classes.inputBox}>
        <FormControl error={!layingStartValid}>
          <InputLabel id="select-helper-label">Início *</InputLabel>

          <Select
            value={selectedLayingStart}
            labelId="select-helper-label"
            style={{ minWidth: 150 }}
            onChange={handleStartChange}
          >
            {Object.keys(corners).map((key) => (
              <MenuItem key={key} value={key.toUpperCase()}>
                {key.toUpperCase()}
              </MenuItem>
            ))}
          </Select>

          {!layingStartValid && (
            <FormHelperText>Local de início é obrigatório</FormHelperText>
          )}
        </FormControl>

        {loadingPosition ? (
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
              label="Cerâmicas cortadas"
              style={{ marginLeft: 32 }}
              value={calcNumberOfCuts()}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default LayingStart;
