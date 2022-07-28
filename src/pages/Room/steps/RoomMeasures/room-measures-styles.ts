import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '900px',
      display: 'flex',
      position: 'relative',
      justifyContent: 'center',
    },
    inputBox: {
      marginTop: 16,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
  })
);

export default useStyles;
