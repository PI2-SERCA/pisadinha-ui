import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  Card,
  CardMedia,
  Typography,
  CardContent,
  CardActionArea,
} from '@material-ui/core';
import { base64ToUrl } from '../../utils/image';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

interface ItemCardProps {
  name: string;
  base64: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({ name, base64 }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          alt={name}
          title={name}
          height="140"
          component="img"
          image={base64ToUrl(base64)}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ItemCard;
