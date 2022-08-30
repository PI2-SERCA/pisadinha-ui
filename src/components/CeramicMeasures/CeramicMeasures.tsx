import React, { Dispatch } from 'react';
import { Box, TextField } from '@material-ui/core';

import { MAX_CERAMIC_SIZE, parseStrToFloat } from '../../utils/number';
import NumberFormatCustom from '../NumberInputField';

import useStyles from './ceramic-measures-styles';

interface CeramicMeasuresProps {
  isLaying?: boolean;
  spacing: number | null;
  setSpacing: Dispatch<number | null>;
  ceramicDepth: number | null;
  setCeramicDepth: Dispatch<number | null>;
  ceramicWidth: number | null;
  setCeramicWidth: Dispatch<number | null>;
  ceramicHeight: number | null;
  setCeramicHeight: Dispatch<number | null>;
  fieldsErrors: Record<string, string>;
  // eslint-disable-next-line react/no-unused-prop-types
  setFieldsErrors?: Dispatch<Record<string, string>>;
}

export const validateCeramicMeasures = ({
  spacing,
  ceramicDepth,
  ceramicWidth,
  ceramicHeight,
  setFieldsErrors,
}: Partial<CeramicMeasuresProps>) => {
  const newFieldsErrors: Record<string, string> = {};
  const maxSizeMsg = `O tamanho máximo de cerâmica é ${MAX_CERAMIC_SIZE}x${MAX_CERAMIC_SIZE}`;

  if (!spacing) newFieldsErrors.spacing = 'Espaçamento é obrigatório';
  if (!ceramicDepth) newFieldsErrors.ceramicDepth = 'Espessura é obrigatório';

  if (!ceramicWidth) newFieldsErrors.ceramicWidth = 'Comprimento é obrigatório';
  else if (ceramicWidth > MAX_CERAMIC_SIZE)
    newFieldsErrors.ceramicWidth = maxSizeMsg;

  if (!ceramicHeight) newFieldsErrors.ceramicHeight = 'Altura é obrigatório';
  else if (ceramicHeight > MAX_CERAMIC_SIZE)
    newFieldsErrors.ceramicHeight = maxSizeMsg;

  if (setFieldsErrors) setFieldsErrors(newFieldsErrors);

  return Object.keys(newFieldsErrors).length === 0;
};

export const CeramicMeasures: React.FC<CeramicMeasuresProps> = ({
  isLaying,
  spacing,
  setSpacing,
  ceramicDepth,
  setCeramicDepth,
  ceramicWidth,
  setCeramicWidth,
  ceramicHeight,
  setCeramicHeight,
  fieldsErrors,
}) => {
  const classes = useStyles();

  return (
    <>
      {isLaying && (
        <Box
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <TextField
            required
            label="Espaçamento (cm)"
            placeholder="Espaçamento"
            style={{ marginBottom: '24px' }}
            value={spacing}
            error={!!fieldsErrors.spacing}
            helperText={fieldsErrors.spacing}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSpacing(parseStrToFloat(e.target.value));
            }}
            InputProps={{
              inputComponent: NumberFormatCustom as React.FC,
            }}
          />
        </Box>
      )}

      <Box className={classes.ceramicContainer}>
        <Box className={classes.measuresCeramic}>
          <div className={classes.ceramicDepth} />

          <TextField
            required
            label="Espessura"
            placeholder="Espessura"
            style={{ margin: '16px 0' }}
            className={classes.measuresInput}
            value={ceramicDepth}
            error={!!fieldsErrors.ceramicDepth}
            helperText={fieldsErrors.ceramicDepth}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setCeramicDepth(parseStrToFloat(e.target.value));
            }}
            InputProps={{
              inputComponent: NumberFormatCustom as React.FC,
            }}
          />
        </Box>

        {isLaying && <div className={classes.ceramic} />}

        <Box className={classes.measuresCeramic}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <div className={classes.ceramic} />

            <TextField
              required
              label="Altura (cm)"
              placeholder="Altura"
              style={{ marginLeft: '16px' }}
              className={classes.measuresInput}
              value={ceramicHeight}
              error={!!fieldsErrors.ceramicHeight}
              helperText={fieldsErrors.ceramicHeight}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCeramicHeight(parseStrToFloat(e.target.value));
              }}
              InputProps={{
                inputComponent: NumberFormatCustom as React.FC,
              }}
            />
          </Box>

          <Box className={classes.ceramicWidthContainer}>
            <TextField
              required
              label="Comprimento (cm)"
              placeholder="Comprimento"
              value={ceramicWidth}
              error={!!fieldsErrors.ceramicWidth}
              helperText={fieldsErrors.ceramicWidth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCeramicWidth(parseStrToFloat(e.target.value));
              }}
              InputProps={{
                inputComponent: NumberFormatCustom as React.FC,
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

CeramicMeasures.defaultProps = {
  isLaying: false,
  setFieldsErrors: () => true,
};

export default CeramicMeasures;
