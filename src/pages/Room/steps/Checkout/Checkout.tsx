import React, { Dispatch, SetStateAction } from 'react';

import {
  Box,
  Card,
  Checkbox,
  CardMedia,
  TextField,
  Typography,
} from '@material-ui/core';

import useStyles from './checkout-styles';

import { base64ToUrl } from '../../../../utils/image';
import { SettlementItem } from '../../../../types';

interface CheckoutProps {
  settlementData: SettlementItem[];
  roomRepetitions: number;
  setRoomRepetitions: Dispatch<number>;
  notSelected: Record<string, boolean>;
  checkoutErrors: Record<string, string>;
  setNotSelected: Dispatch<SetStateAction<Record<string, boolean>>>;
}

export const Checkout: React.FC<CheckoutProps> = ({
  settlementData,
  roomRepetitions,
  setRoomRepetitions,
  notSelected,
  setNotSelected,
  checkoutErrors,
}) => {
  const classes = useStyles();

  const changeSelected = (id: string) => {
    setNotSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <TextField
        type="number"
        variant="outlined"
        value={roomRepetitions}
        error={!!checkoutErrors.roomRepetitions}
        helperText={checkoutErrors.roomRepetitions}
        label="Quantidade de repetições do cômodo"
        InputLabelProps={{ shrink: true }}
        style={{ minWidth: 300, margin: '16px 0' }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setRoomRepetitions(parseInt(e.target.value, 10))
        }
      />

      <Typography
        variant="body2"
        color="secondary"
        style={{ margin: '8px 0 16px 0' }}
      >
        {checkoutErrors.general}
      </Typography>

      <Box className={classes.cutList}>
        {settlementData.map(({ id, repeat, cutImage }) => (
          <Card
            key={id}
            className={classes.card}
            onClick={() => changeSelected(id)}
          >
            <Checkbox
              name="checkedB"
              color="primary"
              checked={!notSelected[id]}
            />

            <Box className={classes.cardContent}>
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                style={{ marginBottom: 0 }}
              >
                {repeat}
              </Typography>

              <Typography variant="h4" component="h2">
                &times;
              </Typography>

              <CardMedia
                component="img"
                alt="Imagem corte"
                image={base64ToUrl(cutImage)}
                className={classes.cutImage}
              />
            </Box>
          </Card>
        ))}
      </Box>
    </>
  );
};

export default Checkout;
