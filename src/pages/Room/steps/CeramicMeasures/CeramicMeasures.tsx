import React, { Dispatch } from 'react';
import { TextField } from '@material-ui/core';

import NumberFormatCustom from '../../../../components/NumberInputField';

import useStyles from './ceramic-measures-styles';

interface CeramicMeasuresProps {
  spacing: number | null;
  setSpacing: Dispatch<number | null>;
  ceramicDepth: number | null;
  setCeramicDepth: Dispatch<number | null>;
  ceramicWidth: number | null;
  setCeramicWidth: Dispatch<number | null>;
  ceramicHeight: number | null;
  setCeramicHeight: Dispatch<number | null>;
  fieldsErrors: Record<string, string>;
}

export const CeramicMeasures: React.FC<CeramicMeasuresProps> = ({
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

  const parseStrToFloat = (str: string) => parseFloat(str.replace(',', '.'));

  return (
    <>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <TextField
          required
          placeholder="Espaçamento"
          style={{ marginBottom: '24px' }}
          value={spacing}
          error={!!fieldsErrors.spacing}
          helperText={fieldsErrors.spacing}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSpacing(parseStrToFloat(e.target.value));
          }}
          InputProps={{
            inputComponent: NumberFormatCustom as any,
          }}
        />
      </div>

      <div className={classes.ceramicContainer}>
        <div className={classes.measuresCeramic}>
          <div className={classes.ceramicDepth} />

          <TextField
            required
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
              inputComponent: NumberFormatCustom as any,
            }}
          />
        </div>

        <div className={classes.ceramic} />

        <div className={classes.measuresCeramic}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={classes.ceramic} />

            <TextField
              required
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
                inputComponent: NumberFormatCustom as any,
              }}
            />
          </div>

          <div className={classes.ceramicWidthContainer}>
            <TextField
              required
              placeholder="Comprimento"
              className={classes.measuresInput}
              value={ceramicWidth}
              error={!!fieldsErrors.ceramicWidth}
              helperText={fieldsErrors.ceramicWidth}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCeramicWidth(parseStrToFloat(e.target.value));
              }}
              InputProps={{
                inputComponent: NumberFormatCustom as any,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CeramicMeasures;
