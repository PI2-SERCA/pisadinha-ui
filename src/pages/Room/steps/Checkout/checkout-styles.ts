import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    cutList: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    card: {
      margin: 8,
      padding: 16,
      minWidth: 360,
      maxWidth: 450,
      display: 'flex',
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'space-between',
      '&:hover': {
        opacity: 0.75,
      },
    },
    cardContent: {
      width: '100%',
      display: 'flex',
      marginLeft: '32px',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    xIcon: {
      width: 32,
      height: 32,
    },
    cutImage: {
      maxWidth: 240,
      maxHeight: 120,
      objectFit: 'contain',
      width: 'fit-content',
      height: 'fit-content',
    },
  })
);

export default useStyles;
