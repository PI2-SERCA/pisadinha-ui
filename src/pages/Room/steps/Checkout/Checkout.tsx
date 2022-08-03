import React, { useState } from 'react';

import {
  Box,
  Card,
  Checkbox,
  CardMedia,
  TextField,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

import useStyles from './checkout-styles';

import { RequestResponse } from '../../../../types';
import { base64ToUrl } from '../../../../utils/image';

interface SettlementItem {
  id: string;
  repeat: number;
  cutImage: string;
}

interface CheckoutProps {
  requestResponse: RequestResponse;
}

export const Checkout: React.FC<CheckoutProps> = ({ requestResponse }) => {
  const classes = useStyles();

  const [roomRepetitions, setRoomRepetitions] = useState(1);
  const [notSelected, setNotSelected] = useState<Record<string, boolean>>({});
  const [settlementData, setSettlementData] = useState<SettlementItem[]>(
    new Array(5).fill({
      id: 'irineu',
      repeat: 7,
      cutImage:
        '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',
    })
  );

  const changeSelected = (id: string) => {
    setNotSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <TextField
        type="number"
        variant="outlined"
        label="Quantidade de repetições do cômodo"
        InputLabelProps={{ shrink: true }}
        style={{ minWidth: 300, margin: '16px 0' }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setRoomRepetitions(parseInt(e.target.value, 10))
        }
      />

      <Box className={classes.cutList}>
        {settlementData.map(({ id, repeat, cutImage }, idx) => (
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

              <Close className={classes.xIcon} />

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
